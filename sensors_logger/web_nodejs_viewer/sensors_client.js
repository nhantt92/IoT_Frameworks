/*
 - Client ws websocket 
*/

$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://10.0.0.12:4348/measures');

					connection.onopen = 
	function()
	{
        // first we want users to enter their names
        status.text('Connected');
		
		var Req = JSON.stringify(statusReq);
		connection.send(Req);
		console.log("request>",statusReq);
		
		Req = JSON.stringify(jReq);
		connection.send(Req);
    };

    connection.onerror = 
	function(error) 
	{
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

	
	function handle_update(upjson)
		{
			var message_text = '';
			for (var nodeid in upjson) 
			{
				message_text += nodeid + " : <br>";
				for(var sk in upjson[nodeid])
				{
					var d = new Date(upjson[nodeid][sk].Times*1000);
					var dtext = d.getHours() +':'+ d.getMinutes() + ':' + d.getSeconds();
					message_text += sk + '(' + upjson[nodeid][sk].Values + ' - ' + dtext + ')<br>';
					if(sk == "Pressure")
					{
						var value = Math.round(upjson[nodeid]["Pressure"].Values);
						//console.log("Press",nodeid, value);
						//d3_SetPressureValue(nodeid,value);
					}
					if(sk == "Temperature")
					{
						var value = Math.round(100*upjson[nodeid]["Temperature"].Values)/100;
						//console.log("Temp",nodeid, value);
						d3_SetTemperatureValue(nodeid,value);
					}
					if(sk == "Humidity")
					{
						var value = Math.round(upjson[nodeid]["Humidity"].Values);
						//console.log("Hum",nodeid, value);
						d3_SetHumidityValue(nodeid,value);
					}
					if(sk == "Light")
					{
						//console.log("Light", nodeid, value);
						d3_SetLightValue(nodeid,upjson[nodeid]["Light"].Values);
					}
				}
				//message_text += '<br>';
			}
		return message_text;
	};
	
	
    // most important part - incoming messages
    connection.onmessage = 
	function(message)
	{
        try 
		{
            var json = JSON.parse(message.data);
        } catch (e) 
		{
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
		//------------------------------------------ response ------------------------------------------
		if("response" in json)
		{
			if(("type" in json.response)&& (json.response.type == "Duration"))
			{
				if(("id" in json.response)&& (json.response.id == jReq.request.id))
				{
					d3_SetChartValues(json.response.Times,json.response.Values);
				}
			}
			else if(("type" in json.response)&& (json.response.type == "update"))
			{
				if(("id" in json.response)&& (json.response.id == jReq.request.id))
				{
					handle_update(json.response.update);
				}
			}
		}
		//------------------------------------------ update ------------------------------------------
		else if("update" in json)
		{
			var message_text = handle_update(json.update);
			
			addMessage(message_text);
			//console.log('update> ', upjson);
		}
    };

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(
		function()
		{
			if (connection.readyState !== 1) 
			{
				status.text('Error');
			}
		}
		, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(message) {
        content.prepend('<p>' + message + '</p>');
		//content.html('<p>' + message + '</p>');
    }
});