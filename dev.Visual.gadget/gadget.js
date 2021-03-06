

// This is the code that runs the main gadget window

// Constants
var REFRESH_INTERVAL = 5;       // minutes
var currentInspector;           // Links the inspector to the flyout window


/////////////////////////////////////////////////////////////////////////////////////
// - Called when the gadget is loaded
/////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function ()
{
    System.Gadget.Flyout.onHide = function ()
    {
        $(".ItemSelected").each(function (index, obj)
        {
            // write the inspector's options to the configuration file, if there are any
            var data = $(obj).data("ins");
            var options = g_inspectors[data.name].options;
            if ("undefined" != typeof (options))
            {
                SettingsManager.setValue("options", data.name, JSON.stringify(options));
            }
            SettingsManager.saveFile();
        });
        $(".ItemSelected").removeClass("ItemSelected");
    }

    //setup the settings stuff
    System.Gadget.settingsUI = "settings.html";
    System.Gadget.onSettingsClosed = settingsClosed;
    System.Gadget.onShowSettings = settingsShow;

    // Make the logo clickable
    $("#gadgetTopBG").dblclick(function () { window.open(L_HOME_URL); }).prop('title', L_LOGO_HELP);

    // Default to a blank inspector (each page element with class Item is an inspector)
    $(".Item").data('ins', g_inspectors["Separator"]);

    // Define what happens when an inspector is clicked
    $(".Item").dblclick(function (e)
    {
        $(".ItemSelected").removeClass("ItemSelected");
        var data = $(this).data("ins");
        //Determine which of the flyout web pages to display based on the Inspector loaded into the position
        if (data.flyout > "")
        {
            $(this).addClass("ItemSelected");
            currentInspector = g_inspectors[data.name];    // save this so the flyout can access the inspector
            System.Gadget.Flyout.file = data.flyout;
            System.Gadget.Flyout.Show = true;
        }
        RefreshInspector($(this));
    });

    // Highlight the inspector that the mouse hovers over
    //  $(".Item").hover(function () { $(this).addClass('ItemHover'); }, function () { $(this).removeClass('ItemHover'); });

    // Load the configuration and display the gadget
    settingsRead();
    dockStateChanged(); //setup the gadget in docked or undocked mode

    InitGadget();
});


/////////////////////////////////////////////////////////////////////////////////////
// Setup the gadget window with the selected inspectors
/////////////////////////////////////////////////////////////////////////////////////
function InitGadget()
{
    $(".Item").removeClass("ItemError");
    $("#divInspector0").show();
    $(".Item").html("");

    // set up the timer to poll the status
    window.setTimeout(updateStatus, 500);  // initial refresh
    window.setInterval(updateStatus, REFRESH_INTERVAL * 60 * 1000);
}


/////////////////////////////////////////////////////////////////////////////////////
// called when the docked state changes
/////////////////////////////////////////////////////////////////////////////////////
function dockStateChanged()
{
    System.Gadget.beginTransition();
    
    if (System.Gadget.docked)
    {
    }
    else
    {
    }
    System.Gadget.endTransition(System.Gadget.TransitionType.morph, 2 );  // transition in 2 sec
}

/////////////////////////////////////////////////////////////////////////////////////
//called when the settings window is opened
/////////////////////////////////////////////////////////////////////////////////////
function settingsShow()
{
}

/////////////////////////////////////////////////////////////////////////////////////
//called when the settings window closes
/////////////////////////////////////////////////////////////////////////////////////
function settingsClosed( p_event )
{
    if (p_event.closeAction == p_event.Action.commit) 
    { //OK clicked?
        $(".Item").data('ins', g_inspectors["Separator"]);
        settingsRead();
        InitGadget();
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Reads the gadget's settings from the settings.ini file and figure out how many
// panels need to be visible
/////////////////////////////////////////////////////////////////////////////////////
function settingsRead()
{
    SettingsManager.loadFile();
    var bPanel2Visible = false;
    var bPanel3Visible = false;
    var height = 169;
    for (var i = 0; i < MAX_INSPECTORS; i++)
    {
        try
        {
            // try to load the inspector for this position.  if there is an inspector on 
            // panel 2 or 3, make sure it is visible
            var name = SettingsManager.getValue("included", i, "");
            if (typeof (g_inspectors[name]) != 'undefined')
            {
                //Trace ("loading inspector: " + g_inspectors[name]);
                $("#divInspector" + i).data('ins', g_inspectors[name]);
                if (i > 7 && i < 16) bPanel2Visible = true;
                if (i > 15 && i < 24) bPanel3Visible = true;
                var options = SettingsManager.getValue("options", name, "");
                if (options > "")
                {
                    // read in some options, set them one at a time in case
                    // a gadget upgrade resulted in mismatched options
                    var objOptions = JSON.parse(options);
                    for (var opt in objOptions)
                    {
                        g_inspectors[name].options[opt] = objOptions[opt];
                    } 
                }
            }
        }
        catch (e) { }
    }

    // Set the size of the gadget to show all the visible panels
    document.body.style.height = 169;
    if (bPanel2Visible)
    {
        $("#panel2").show();
        height += 134;
    }
    else
        $("#panel3").hide();

    if (bPanel3Visible)
    {
        $("#panel3").show();
        height +=  134;
    }
    else $("#panel3").hide();

    document.body.style.height = height;        
}

/////////////////////////////////////////////////////////////////////////////////////
// called on a timer to update all the inspectors
/////////////////////////////////////////////////////////////////////////////////////
function updateStatus()
{
    if (OpenDatabase())
    {
        // For each inspector in the gadget, update the display
        $('.Item').each(function (index, obj)
        {
            RefreshInspector(obj);
        });
        CloseDatabase();
    }
}



/////////////////////////////////////////////////////////////////////////////////////
// Refreshes the inspector passed as a parameter (should point to the DOM object)
/////////////////////////////////////////////////////////////////////////////////////
function RefreshInspector( obj )
{    
    // Request the data (asynchronously) from the server
    var inspector = $(obj).data("ins");

    $(obj).show();
    if ("undefined" != typeof(inspector.fnShortSql ))
    {
        // get the SQL query we need to run
        var sql = inspector.fnShortSql(inspector.options);
       
        // Get the data...
        if( "undefined" != typeof( L_CONNECTION_STRING ))
        {
            // via Windows DB interface
            var data = QueryDatabase( "d", sql );

            if ('undefined' != typeof (data.error))
            {
                // request was successful, but an error was returned
                $(obj).addClass("ItemError").attr("title", data.error.description);
                $(obj).html(inspector.shortTitle + JustifyRight("Err"));
            }
            else
            {
                //$(obj).addClass("ItemError").attr("title", sql);
                $(obj).removeClass("ItemError").removeAttr("title");
                $(obj).html(inspector.fnRenderShort(data));
            }
        }
        else
        {
            // Call the server to get the data for this inspector
            $.ajax(
	        {
	            type: 'GET'
	            , url: L_JSON_QUERY_URL
	            , dataType: "jsonp"
	            , cache: false
	            , data:
		        {
		            server: encodeURIComponent(config.server)
		            , database: encodeURIComponent(config.database)
		            , queries: JSON.stringify([{ id: 'd', sql: sql}])
		        }
	            , success: function (data, textStatus, jqXHR) 
                {
                    if ('undefined' != typeof (data.error)) 
                    {
	                    // request was successful, but an error was returned
	                    $(obj).addClass("ItemError").attr("title", data.error);
	                    $(obj).html(inspector.shortTitle + JustifyRight("Err"));
	                }
	                else 
                    {
	                    $(obj).removeClass("ItemError").removeAttr("title");
	                    $(obj).html(inspector.fnRenderShort(data));
	                }
	            }
                , error: function (jqXHR, textStatus, errorThrown) 
                {
                
                    $(obj).addClass("ItemError").attr("title", textStatus + ": " + errorThrown);
                    $(obj).html(inspector.shortTitle + JustifyRight("N/A"));
                }
	        });
        }
    }
    else
    {
        if ("undefined" != typeof (inspector.fnRenderShort))
        {
            $(obj).removeClass("ItemError").removeAttr("title");
            $(obj).html(inspector.fnRenderShort());
        }
        else
        {
            $(obj).hide();
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Called from the flyout when options have changed.  update the inspector
/////////////////////////////////////////////////////////////////////////////////////
function UpdateInspectorOptions( insp )
{
    if (OpenDatabase())
    {
        // do for any element that has the ItemSelected class (there is probably only one)
        $(".ItemSelected").each(function (index, obj)
        {
            RefreshInspector(obj);
        });
        CloseDatabase();
    }
}

