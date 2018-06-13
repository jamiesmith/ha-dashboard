function base_day_forecast(widget_id, url, skin, parameters)
{
    self = this;
    self.widget_id = widget_id;
    self.parameters = parameters;

    if ("monitored_entity" in self.parameters)
    {
        entity = self.parameters.monitored_entity
    }
    else
    {
        entity = self.parameters.entity
    }

    var callbacks = [];

    self.OnStateAvailable = OnStateAvailable;
    self.OnStateUpdate = OnStateUpdate;

    var monitored_entities =
        [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate}
        ];

    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)

    function OnStateAvailable(self, state)
    {
		// console.log("OnStateAvailable self =>", self);
		console.log("OnStateAvailable state =>", state);
		
        set_view(self,state);
    }
 
    function OnStateUpdate(self, state)
    {
        set_view(self,state);
    }

    function set_view(self,state){
        self.icon = 'mdi ' + state.attributes.icon.replace(':','-');
        self.title = state.attributes.friendly_name;
        self.value = state.state;

        self.set_field(self, "icon", self.icon)
        self.set_field(self, "value", self.value)
        self.set_field(self, "title", self.title)
    }

}
