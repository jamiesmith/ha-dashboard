function baseplaylist(widget_id, url, skin, parameters)
{
    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...
    
    self = this;
    
    // Initialization
    
    self.widget_id = widget_id;
    
    // Parameters may come in useful later on
    //
    self.playlist = "";
    self.favorite = "";
    self.shuffle = "";

    self.parameters = parameters;
    
    if ("playlist" in parameters.fields)
    {
	self.playlist = parameters.fields.playlist;
    }
    if ("favorite" in parameters.fields)
    {
	self.favorite = parameters.fields.favorite;
    }

    if ("shuffle" in parameters.fields)
    {
	self.shuffle = parameters.fields.shuffle;
    }

    // Toggle needs to be referenced from self for the timeout function
    
    self.toggle = toggle;
    
    // Define callbacks for on click events
    // They are defined as functions below and can be any name as long as the
    // 'self'variables match the callbacks array below
    // We need to add them into the object for later reference
   
    self.OnButtonClick = OnButtonClick;
    
    if ("enable" in self.parameters && self.parameters.enable == 1)
    {
        var callbacks =
            [
                {"selector": '#' + widget_id + ' > span', "action": "click", "callback": self.OnButtonClick},
            ]
    }            
    else
    {
        var callbacks = []
    }        
    // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity
     
    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate
    
    var monitored_entities = 
        [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate},
        ];
    
    // Finally, call the parent constructor to get things moving
    
    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)  

    // Function Definitions
    
    // The StateAvailable function will be called when 
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state
    
    function OnStateAvailable(self, state)
    {        
        self.state = state.state;
        set_view(self, self.state)
    }
    
    // The OnStateUpdate function will be called when the specific entity
    // receives a state update - its new values will be available
    // in self.state[<entity>] and returned in the state parameter
    
    function OnStateUpdate(self, state)
    {
        if (!("ignore_state" in self.parameters) || self.parameters.ignore_state == 0)
        {
            self.state = state.state;
            set_view(self, self.state)
        }
    }
    
    function OnButtonClick(self)
    {
	// Overloaded. If it's got both, use the favorite
	//
	if (self.favorite)
	{
	    console.log("got a favorite: " + self.favorite);
	    args = self.parameters.post_service_favorite
	    
	    args["source"] = self.favorite
	    console.log("Starting FAVORITE => ", args);
	    
	    self.call_service(self, args);
	    
	}
	else if (self.playlist)
	{
	    console.log("got a playlist", self.playlist);
	    args = self.parameters.post_service_playlist
	
	    args["media_content_id"] = self.playlist
	    console.log("Starting Playlist => ", args);
	}
	
	self.call_service(self, args);
	if (self.shuffle != "")
	{
	    args2 = self.parameters.post_service_shuffle;
	    args2["shuffle"] = self.shuffle;
	    self.call_service(self, args2)
	}
    }
    
    function toggle(self)
    {
    }
    
    // Set view is a helper function to set all aspects of the widget to its 
    // current state - it is called by widget code when an update occurs
    // or some other event that requires a an update of the view
    
    function set_view(self, state, level)
    {
    }
}
