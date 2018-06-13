function basesonos(widget_id, url, skin, parameters)
{
	console.log("basesonos")
	
	// Will be using "self" throughout for the various flavors of "this"
	// so for consistency ...
	
	self = this
	
	// Initialization
	
	self.widget_id = widget_id
	
	// Parameters may come in useful later on
	
	self.parameters = parameters
	self.OnChange = OnChange

	var callbacks =
    [
        {"selector": '#' + widget_id + ' #select-sonos-playlist', "action": "change", "callback": self.OnChange},
    ]

	// Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
	// Initial will be called when the dashboard loads and state has been gathered for the entity
	// Update will be called every time an update occurs for that entity
	
	self.OnStateAvailable = OnStateAvailable
	self.OnStateUpdate = OnStateUpdate
	
	if ("entity" in parameters)
	{
		var monitored_entities = 
			[
				{"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate}
			]
	}
	else
	{
		var monitored_entities =	[]
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
		console.log("OnStateAvailable")
		
		console.log("self:")
		console.log(self)
		console.log("states:")
		console.log(state)

		console.log("state is:" + state.state)


		self.state = state.state
		
		set_options(self, state.attributes.source_list, state)
		set_value(self, state)
	}
	
	function OnStateUpdate(self, state)
	{
		console.log("OnStateUpdate")
		console.log("OnStateUpdate state is:" + state.state)
		
		self.state = state.state
		set_options(self, state.attributes.source_list, state)
		set_value(self, state)
	}


	function OnChange(self, state)
	{
		console.log("OnChange")
		console.log("OnChange self =>")
		console.log(self)

		console.log("OnChange state =>")
		console.log(state)
		
		console.log("OnChange state is:" + self.state)
		
		setTimeout(function(){
			if (self.state != self.ViewModel.selectedoption())
			{
				self.source = self.ViewModel.selectedoption()
				args = self.parameters.post_service
				args["source"] = self.source
				
				// if (self.state == "paused")
				// {
				// 	args["state"] = self.state
				// }
				
				console.log("Calling Service")
				console.log(args)
				self.call_service(self, args)
			}
		},500)
	}

	function set_value(self, state)
	{
		console.log("set_value")
		
		value = state.attributes.source
		self.set_field(self, "selectedoption", value)
	}

	function set_options(self, options, state)
	{
		console.log("set_options")
		
		self.set_field(self, "inputoptions", options)
	}

}
