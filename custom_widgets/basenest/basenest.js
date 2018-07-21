function basenest(widget_id, url, skin, parameters)
{

    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...

    self = this

    // Initialization

    self.widget_id = widget_id

    // Parameters may come in useful later on

    self.parameters = parameters
    self.OnRaiseHeatLevelClick = OnRaiseHeatLevelClick
    self.OnLowerHeatLevelClick = OnLowerHeatLevelClick
    self.OnRaiseCoolLevelClick = OnRaiseCoolLevelClick
    self.OnLowerCoolLevelClick = OnLowerCoolLevelClick

    var callbacks =
        [
            {"selector": '#' + widget_id + ' #heat-level-up', "action": "click", "callback": self.OnRaiseHeatLevelClick},
            {"selector": '#' + widget_id + ' #heat-level-down', "action": "click", "callback": self.OnLowerHeatLevelClick},
            {"selector": '#' + widget_id + ' #cool-level-up', "action": "click", "callback": self.OnRaiseCoolLevelClick},
            {"selector": '#' + widget_id + ' #cool-level-down', "action": "click", "callback": self.OnLowerCoolLevelClick},
        ]

    // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity

    self.OnFanAvailable = OnFanAvailable
    self.OnFanUpdate = OnFanUpdate

    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate

    self.OnNestAvailable = OnNestAvailable
    self.OnNestUpdate = OnNestUpdate
    
    var monitored_entities = [];

    // I wonder if I can just calculate the other things from the nest name?
	//
    if ("nest_entity" in parameters)
    {
		// console.log("parameters.nest_entity =>", parameters.nest_entity);
        monitored_entities.push({"entity": parameters.nest_entity, "initial": self.OnNestAvailable, "update": self.OnNestUpdate});
    }

    if ("state_entity" in parameters)
    {
        monitored_entities.push({"entity": parameters.state_entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate});
    }

    if ("fan_entity" in parameters)
    {
        monitored_entities.push({"entity": parameters.fan_entity, "initial": self.OnFanAvailable, "update": self.OnFanUpdate});
    }
    
    if( "step" in parameters && ! isNaN(self.parameters.step))
    {
        self.step = parseFloat(parameters.step)
    }
    else
    {
        self.step = 1
    }

    // Finally, call the parent constructor to get things moving

    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)

    // Function Definitions

    // The StateAvailable function will be called when
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state
    // Methods

    function OnStateAvailable(self, state)
    {
		self.state = state.state;

		// TODO: This seems right, just need to get the HTML and icon working
		//
		self.set_field(self, "state", state.state);

		set_state_view(self, state);
    }

    function OnStateUpdate(self, state)
    {
		// TODO: This seems right, just need to get the HTML and icon working
		//
		self.set_field(self, "state", state.state);

		set_state_view(self, state);
    }

    function OnFanAvailable(self, state)
    {
		// console.log("OnFanAvailable self:", self);
		// console.log("OnFanAvailable state:", state);
		self.fan = state.state;

		// TODO: This seems right, just need to get the HTML and icon working
		//
		self.set_field(self, "fan", state.fan);

		set_fan_view(self, state);
    }

    function OnFanUpdate(self, state)
    {
		// console.log("OnFanUpdate self:", self);
		// console.log("OnFanUpdate state:", state);

		// TODO: This seems right, just need to get the HTML and icon working
		//
		self.set_field(self, "fan", state.state);

		set_fan_view(self, state);
    }
	
    function OnNestAvailable(self, state)
    {
		self.state = state.state;
		self.min = state.attributes.min_temp
		self.max = state.attributes.max_temp

		self.min_heat = state.attributes.min_temp
		self.max_heat = 75

		self.min_cool = 60
		self.max_cool = state.attributes.max_temp

		// self.level = state.attributes.temperature
		self.level = state.attributes.current_temperature

		self.heat_level = state.attributes.target_temp_low
		self.cool_level = state.attributes.target_temp_high

		self.set_field(self, "unit", state.attributes.unit_of_measurement)

		set_nest_view(self, state)
    }

    function OnNestUpdate(self, state)
    {
        // self.level = state.attributes.temperature
        self.level = state.attributes.current_temperature
        self.heat_level = state.attributes.target_temp_low
        self.cool_level = state.attributes.target_temp_high

        set_nest_view(self, state)
    }

    function OnRaiseHeatLevelClick(self)
    {
	self.heat_level = parseFloat(self.heat_level) + self.step;

	if (self.heat_level > self.max_heat)
	{
            self.heat_level = self.max_heat
	}
	args = self.parameters.post_service
	args["target_temp_low"] = self.heat_level
	args["target_temp_high"] = self.cool_level
	
	self.call_service(self, args)
    }

    function OnLowerHeatLevelClick(self, args)
    {
	self.heat_level = parseFloat(self.heat_level) - self.step;
	if (self.heat_level < self.min_heat)
	{
            self.heat_level = self.min_heat
	}
	args = self.parameters.post_service;
	args["target_temp_low"] = self.heat_level
	args["target_temp_high"] = self.cool_level
	
	self.call_service(self, args)
    }

    function OnRaiseCoolLevelClick(self)
    {
	self.cool_level = parseFloat(self.cool_level) + self.step;

	if (self.cool_level > self.max_cool)
	{
            self.cool_level = self.max_cool
	}
	args = self.parameters.post_service
	args["target_temp_low"] = self.heat_level
	args["target_temp_high"] = self.cool_level
	
	self.call_service(self, args)
    }

    function OnLowerCoolLevelClick(self, args)
    {
	self.cool_level = parseInt(self.cool_level) - self.step;
	if (self.cool_level < self.min_cool)
	{
            self.cool_level = self.min_cool
	}
	args = self.parameters.post_service;
	args["target_temp_low"] = self.heat_level
	args["target_temp_high"] = self.cool_level
	
	self.call_service(self, args)
    }


    function set_state_view(self, state)
    {
//        self.set_field(self, "level", self.format_number(self, state.attributes.current_temperature));
    }

    function set_fan_view(self, state)
    {
//        self.set_field(self, "level", self.format_number(self, state.attributes.current_temperature));
    }

    function set_nest_view(self, state)
    {
        // self.set_field(self, "play_icon_style", self.css.icon_style_active);
        // self.set_icon(self, "play_icon", self.icons.pause_icon)

        self.set_field(self, "level", self.format_number(self, state.attributes.current_temperature));
        if ("temperature" in state.attributes && state.attributes.temperature != null)
        {
            self.set_field(self, "level2", self.format_number(self, state.attributes.temperature));
        }
        else
        {
            self.set_field(self, "level2", "auto")
            self.set_field(self, "heat_level", self.format_number(self, state.attributes.target_temp_low))
            self.set_field(self, "cool_level", self.format_number(self, state.attributes.target_temp_high))          
        }
    }
}
