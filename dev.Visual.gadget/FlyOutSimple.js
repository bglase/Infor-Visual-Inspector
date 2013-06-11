

var inspector;



/////////////////////////////////////////////////////////////////////////////////////
// Runs at document load.  Initializes everything
/////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function ()
{
    // If the system object is defined, it means this window is running as a gadget flyout, so get the parameters from the gadget window.
    if ("undefined" != typeof (System))
    {
        inspector = System.Gadget.document.parentWindow.currentInspector;
    }
    else
    {   // for testing...
        inspector = g_inspectors["name of the inspector you want to test"];
    }

    $("#bannerlink").html(inspector.shortTitle);    // Set title of the window

    var sql = inspector.fnFlyoutSql();

    // Called when data is successfully retrieved
    function success(data, textStatus, jqXHR)
    {
        if ('undefined' != typeof (data.error))
        {
            // request was successful, but an error was returned
            ShowError(LI.serverError + ": " + data.error);
        }
        else
        {
            $('#divOutput').html(inspector.fnRenderFlyout(data.aData));
            document.body.style.height = $(document).height();
        }
    }

    function error(jqXHR, textStatus, errorThrown)
    {
        ShowError(LI.serverContactError + ": " + errorThrown);
        document.body.style.height = $(document).height();
    }

    // Get the data...
    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        // via Windows DB interface
        if (OpenDatabase())
        {
            var data = QueryDatabase( "aData", sql);
            CloseDatabase();
            success(data, "", null);
        }
        else
            error(null, "", "Error opening database");
    }
    else
    {
        // load from the remote web server
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
		        , queries: JSON.stringify([{ id: 'aData', sql: sql}])
		    }
	        , success: success
            , error: error
	    });
        $('#divOutput').html("<span style='width:100%; text-align: center;'>" + LF.loading + "</span></div>");
    }

    // Attach an event handler to those elements that support launching into Visual
    // the Visual module we want to launch is stored in the 'name' attribute of the element
    if (ie)
    {
        $('#divOutput.cssVisualLink').live('click', function () { LaunchVmx($(this).attr("name"), $(this).attr("item")); });

    }

});

