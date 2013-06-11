

var inspector;
var oTable;
var anOpen = new Array();
// stores parameters for this flyout
var g_params = new Object;


/////////////////////////////////////////////////////////////////////////////////////
// If running as a gadget flyout, adjust the window height to fit everything
// This process is trickier than you might think... modify with caution
/////////////////////////////////////////////////////////////////////////////////////
function SetWindowHeight()
{
    // System.Debug.outputString("$doc height: "+ $(document).height() + " Window: " + $(window).height() + " innerHeight: " + window.innerHeight);
    // System.Debug.outputString("offset height: " + document.body.offsetHeight);

    // If the System object is defined, it means we are running in the Windows gadget and should try to resize the window
    if ("undefined" != typeof (System))
        document.body.style.height = $(document).height();

    //  window.innerHeight = $(document).height();
    //   System.Debug.outputString("post innerheight " + window.innerHeight + ' docbody'+ document.body.style.height );
    // System.Debug.outputString("$flyout height: "+ document.body.style.height);
}


/////////////////////////////////////////////////////////////////////////////////////
// Display an error and adjust the window size if necessary
/////////////////////////////////////////////////////////////////////////////////////
function ShowFlyoutError(s)
{
    ShowError(s);
    SetWindowHeight();
}


/////////////////////////////////////////////////////////////////////////////////////
// Reloads data from an ajax call.  This is used for example when the date range is
// changed
/////////////////////////////////////////////////////////////////////////////////////
$.fn.dataTableExt.oApi.fnReloadAjax = function (oSettings, sNewSource, fnCallback, bStandingRedraw)
{
    if (typeof sNewSource != 'undefined' && sNewSource != null)
    {
        oSettings.sAjaxSource = sNewSource;
    }
    this.oApi._fnProcessingDisplay(oSettings, true);
    var that = this;
    var iStart = oSettings._iDisplayStart;
    var aData = [];

    this.oApi._fnServerParams(oSettings, aData);

    oSettings.fnServerData(oSettings.sAjaxSource, aData, function (json)
    {
        // Clear the old information from the table
        that.oApi._fnClearTable(oSettings);

        // Got the data - add it to the table 
        var aData = (oSettings.sAjaxDataProp !== "") ?
			that.oApi._fnGetObjectDataFn(oSettings.sAjaxDataProp)(json) : json;

        for (var i = 0; i < aData.length; i++)
        {
            that.oApi._fnAddData(oSettings, aData[i]);
        }

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        that.fnDraw();

        if (typeof bStandingRedraw != 'undefined' && bStandingRedraw === true)
        {
            oSettings._iDisplayStart = iStart;
            that.fnDraw(false);
        }

        that.oApi._fnProcessingDisplay(oSettings, false);

        //Callback user function - for event handlers etc 
        if (typeof fnCallback == 'function' && fnCallback != null)
        {
            fnCallback(oSettings);
        }
    }, oSettings);
}


/////////////////////////////////////////////////////////////////////////////////////
// Get details row using an SQL Query.
/////////////////////////////////////////////////////////////////////////////////////
function fnSqlDetails(oTable, nTr)
{
    var oData = oTable.fnGetData(nTr);

    // SQL statement we want to evaluate is specified by the selected inspector
    var sql = inspector.tableConfig.fnSqlDetails(oData, inspector.options, g_params);
    

    // Get the data...
    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        // via Windows DB interface
        if (OpenDatabase())
        {
            var data = QueryDatabase("aData", sql);
            CloseDatabase();
            
            if ('undefined' != typeof (data.error))
            {
                // request was successful, but an error was returned
                ShowError( data.error.description);
                SetWindowHeight();
            }
            else
            {
                return '<div class="innerDetails"><span style="width:100%; text-align: center;">' + (inspector.tableConfig.fnFormatDetails(data, inspector.options, g_params)) +"</span></div>"; 
            }
        }
        else
            ShowFlyoutError( "Error opening database");
    }
    else
    {
        // Make an ajax call to the server to get the data
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
	        , success: function (data, textStatus, jqXHR)
	        {
	            if ('undefined' != typeof (data.error))
	            {
	                // request was successful, but an error was returned
	                $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', data.error.description);
	                SetWindowHeight();
	            }
	            else
	            {
	                $('div.innerDetails', $(nTr).next()[0]).html(inspector.tableConfig.fnFormatDetails(data, inspector.options, g_params));
	                SetWindowHeight();
	            }
	        }

            , error: function (jqXHR, textStatus, errorThrown)
            {
                $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', errorThrown);
                SetWindowHeight();
            }
	    });

        // This is shown immediately( the asynchronous AJAX call above will replace it when it 
        // receives the data from the server)
        return '<div class="innerDetails"><span style="width:100%; text-align: center;">' + LF.loading + "</span></div>";
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Get details row (when user opens details).  Either does an SQL or custom details
// row, depending on what the inspector supports
/////////////////////////////////////////////////////////////////////////////////////
function fnFormatDetails(oTable, nTr)
{

    if ("undefined" != typeof (inspector.tableConfig.fnGetDetails))
    {
        return inspector.tableConfig.fnGetDetails(oTable, nTr);
    }
    else
    {
        return fnSqlDetails(oTable, nTr);
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Configuration for the TableTools button bar
/////////////////////////////////////////////////////////////////////////////////////
TableTools.BUTTONS.copy_to_clip =
{
    "sAction": "text",
    "sFieldBoundary": "",
    "sFieldSeperator": "\t",
    "sNewLine": "\r\n",
    "sToolTip": LF.tooltipCopyToClipboard,
    "sButtonClass": "ui-state-default",
    "sButtonClassHover": "ui-state-hover",
    "sButtonText": "",
    "mColumns": "visible",
    "bHeader": true,
    "bFooter": true,
    "fnMouseover": null,
    "fnMouseout": null,
    "fnClick": function (nButton, oConfig)
    {
        copyToClipboard(this.fnGetTableData(oConfig));
    },
    "fnSelect": null,
    "fnComplete": null,
    "fnInit": null
};

TableTools.BUTTONS.send_to_email =
{
    "sAction": "text",
    "sFieldBoundary": "",
    "sFieldSeperator": "</td><td>",
    "sNewLine": "</td></tr> <tr><td>",
    "sToolTip": LF.tooltipSendEmail,
    "sButtonClass": "ui-state-default",
    "sButtonClassHover": "ui-state-hover",
    "sButtonText": "Send Email",
    "mColumns": "visible",
    "bHeader": true,
    "bFooter": true,
    "fnMouseover": null,
    "fnMouseout": null,
    "fnClick": function (nButton, oConfig)
    {
        //  var data;
        //  if (this.fnGetSelected().length == 0)
        //      data = this.fnGetData
        //     var aData = oTT.fnGetSelectedData();
        var top = "<table><tr><td>";
        var bottom = "  </td></tr></table>";
        SendEmail(inspector.shortTitle, top+  this.fnGetTableData(oConfig) + bottom );
    },
    "fnSelect": null,
    "fnComplete": null,
    "fnInit": null
};

TableTools.BUTTONS.send_to_excel =
{
    "sAction": "text",
    "sFieldBoundary": "",
    "sFieldSeperator": "\t",
    "sNewLine": "\r\n",
    "sToolTip": LF.tooltipSendToExcel,
    "sButtonClass": "ui-state-default",
    "sButtonClassHover": "ui-state-hover",
    "sButtonText": "Send to Excel",
    "mColumns": "visible",
    "bHeader": true,
    "bFooter": true,
    "fnMouseover": null,
    "fnMouseout": null,
    "fnClick": function (nButton, oConfig)
    {
        OpenSpreadsheet(this.fnGetTableData(oConfig));
    },
    "fnSelect": null,
    "fnComplete": null,
    "fnInit": null
};


/////////////////////////////////////////////////////////////////////////////////////
// Some helper functions to implement a simple menu
/////////////////////////////////////////////////////////////////////////////////////
var menu_timeout = 500;
var menu_closetimer = 0;
var menu_ddmenuitem = 0;

function menu_toggle()
{
   
    var element = $(this).find('ul');
    if ("visible" == element.css('visibility'))
    {
        menu_canceltimer();
        menu_close();
    }
    else
    {
        menu_canceltimer();
        menu_close();
        menu_ddmenuitem = $(this).find('ul').addClass('open');
    }
}
function menu_close()
{
    if (menu_ddmenuitem) menu_ddmenuitem.removeClass('open');
}
function menu_timer()
{  menu_closetimer = window.setTimeout(menu_close, menu_timeout); }
function menu_canceltimer()
{
   
    if (menu_closetimer)
    {
        window.clearTimeout(menu_closetimer);
        menu_closetimer = null;
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Runs at document load.  Initializes everything
/////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function ()
{
    g_params.refDate = new Date().clearTime();
    g_params.startDate = new Date().clearTime();
    g_params.endDate = new Date().clearTime();

    // If the system object is defined, it means this window is running as a gadget flyout, so get the parameters from the gadget window.
    if ("undefined" != typeof (System))
    {
        inspector = System.Gadget.document.parentWindow.currentInspector;
        if ("undefined" != typeof (inspector.fullWindowUrl))
        {
            // Set up a link to open the full window URL if one is specified for this inspector
            //   $("<a />").click(function () { window.open(inspector.fullWindowUrl); }).appendTo("#linkmenu").text(L_FULL);
        }
    }
    else
    {
        // Assume the inspector variable has already been set (by the web server ASPX)
        // uncomment the below to force a specific inspector (for testing purposes in a browser)
        inspector = g_inspectors["Receivers"];
    }

    $("#bannerlink").html(inspector.shortTitle);    // Set title of the window

    // If the inspector has parameters, set up the selection controls
    if ("undefined" != typeof (inspector.params))
    {
        $.each(inspector.params, function (i, e)
        {
            var element;
            if ('interval' == i)
            {
                element = $("#menuInt ul");
                // Enable the date selector controls
                $("#selectprev").click(PrevInterval);
                $("#selectnext").click(NextInterval);
                $("#selectdate").show();
                // $("#bannerselector");

                // Initialize the date picker
                $("#datepicker").datepicker(
                {
                    dateFormat: 'DD, d MM, yy',
                    showButtonPanel: true,
                    beforeShowDay: $.datepicker.noWeekends,
                    buttonImageOnly: true,
                    showOn: 'button',
                    //showOn: "button",
                    numberOfMonths: 3,
                    buttonImage: "images/calendar.gif",
                    onSelect: function (dateText, inst)
                    {
                        g_params.refDate = $(this).datepicker("getDate");
                        UpdateDateFilter();
                    }
                });
            }
            else
                element = $("#menuParam1 ul");

            element.empty().attr("name", i);
            element.parent().show();
            $.each(e, function (key, value)
            {
                element.append("<li class='ui-state-default' name='" + key + "'>" + value + "</li>");
            });

            if (i in inspector.options)
            {   // set the default
                $("span", element.parent()).text(e[inspector.options[i]]);
            }

            CalculateInterval();
            ShowInterval()

        });

        $('.menu-base').click(menu_toggle);
        $('.menu-base').bind('mouseout', menu_timer);
        $('.menu-base').bind('mouseover', menu_canceltimer);
        $('.menu-base > ul > li').click(function (e)
        {
            // User chose a selection from one of the menus
            menu_close();
            $("span", $(this).parent().parent()).text($(this).text());
            inspector.options[$(this).parent().attr("name")] = $(this).attr("name");
            UpdateDateFilter();
            if ("undefined" != typeof (System))
            {   // Update the main gadget window with the new interval & dates
                System.Gadget.document.parentWindow.UpdateInspectorOptions(inspector);
            }
        });

    }

    // remember the AJAX data request handle, so we can cancel it if we need to
    var xhrRequest = null;

    // Set up the main data table for the page
    tableOptions =
    {
        "bJQueryUI": true                              // Use theme colors and styling
        , "sPaginationType": "full_numbers"
		, "sDom": '<"H"Tf>t<"F"irp>'             // arrange the table controls, like the next page buttons
        , "oTableTools":
        {
            //"sRowSelect": "multi"
            //,"sSelectedClass": "row_selected"
            "aButtons":
            [
				{ "sExtends": "copy_to_clip", "sButtonText": LF.copy }
				, { "sExtends": "send_to_email", "sButtonText": LF.email }
				, { "sExtends": "send_to_excel", "sButtonText": LF.excel }
    		]
        }
        //, "bStateSave": true             // remember filter settings, etc for next time the page is loaded
        , "bProcessing": true            // Show a message when retrieving data
        , "oLanguage": { "sProcessing": LF.processing }
        , "iDisplayLength": 15
        , "aoColumns": inspector.tableConfig.columnConfig      // configuration of the columns
        , "fnInitComplete": function (oSettings, json)
        {
            SetWindowHeight();
        }
        , "fnDrawCallback": function ()
        {
        }
        , "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay)
        {
            // Called when the footer is drawn.  Calculate totals for any columns we are supposed to

            if (("undefined" != typeof (nRow)) && ("undefined" != typeof (inspector.tableConfig.totals)))
            {
                // Modify the footer row to match what we want 
                var nCells = $("th", nRow);
                if (0 == nCells.length)
                {
                    // this happens when the table is initialized and there are not
                    // yet any cells in the footer.  We have to do it here, since fnFooterCallback is called
                    // before fnInitComplete.  Add TH cells to the footer for every visible column
                    $("#tbl > thead > tr:last >th").each(function (index, element)
                    {
                        $('#tbl > tfoot >tr:last').append("<th></th>");
                    });
                    nCells = $("th", nRow);
                }

                for (var i = 0; i < inspector.tableConfig.totals.length; i++)
                {
                    var total = 0;
                    var o = inspector.tableConfig.totals[i];

                    switch (o.type)
                    {
                        case "sum":
                            // Total all the rows in the data set 
                            //    for (var row = 0; row < aaData.length; row++)
                            //    {
                            //        total += aaData[row][o.column] * 1;
                            //    }

                            // total only rows on this page
                            //   for (var row = iStart; row < iEnd; row++)
                            //   {
                            //       total += aaData[aiDisplay[row]][o.column] * 1;
                            //   }

                            // total filtered rows, even if they are not on the current page
                            for (var row = 0; row < aiDisplay.length; row++)
                            {

                                total += aaData[aiDisplay[row]][o.column] * 1;
                            }
                            break;

                        case "percent":
                            // Display percentage of rows meeting a criteria
                            // aiDisplay.length is the (filtered) number of rows: the denominator
                            // To find the numerator we have to iterate and check the conditions
                            var denom = (aiDisplay.length > 0) ? aiDisplay.length : 1;
                            var num = 0;
                            for (var row = 0; row < aiDisplay.length; row++)
                            {
                                if (o.fnCheckRowCriteria(aaData[aiDisplay[row]])) num++;
                            }
                            total = (num * 100 / denom).toFixed(0);
                            break;

                    }

                    var cell = nCells.get(o.position);
                    if (null != cell)
                    {
                        if ("undefined" != inspector.tableConfig.totals[i].fnRender)
                            cell.innerHTML = inspector.tableConfig.totals[i].fnRender(total, inspector.options);
                        else
                            cell.innerHTML = formatNumber(total, 2, '', ".", '', '', '(', ')');
                        // Apply CSS class if given to us

                        if ("undefined" != typeof (inspector.tableConfig.totals[i].sClass))
                            cell.className = inspector.tableConfig.totals[i].sClass;
                    }
                }
            }
        }
    };


    // Get the sql we should execute
    var sql = inspector.tableConfig.fnGetSql(inspector.options, g_params);

    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        // get the data now so the table has it to start up
        if (OpenDatabase())
        {
            var data = QueryDatabase("aData", sql);
            CloseDatabase();
            if ("undefined" != typeof (data.error))
            {
                ShowFlyoutError(data.error.description);
            } 
            tableOptions['aaData'] = data.aData;
        }
        else
        {
            ShowFlyoutError("Error opening database");
            tableOptions['aaData'] = [];
        }
    }
    else
    {
        // set the table to get its data from a web source
        tableOptions["sAjaxSource"] = L_WEB_SERVER_ROOT + '/util/vqueryjson.aspx';  // Address of the web service
        tableOptions["fnServerParams"] = function (aoData)
        {
            aoData.push({ "name": "server", "value": config.server });
            aoData.push({ "name": "database", "value": config.database });
            aoData.push({ "name": "queries", "value": JSON.stringify([{ id: 'aData', sql: sql}]) });
        };
        tableOptions["fnServerData"] = function (sUrl, aoData, fnCallback)
        {
            // use jsonp for data query, to allow cross-domain requests.  Use a custom parsing function so dates are handled properly
            if (null != xhrRequest) xhrRequest.abort();
            xhrRequest = $.ajax({ "url": sUrl, "data": aoData, "success": function (data)
            {

                if ("undefined" == typeof (data.error))
                    fnCallback(data);
                else
                //there was an error returned from the query
                    ShowFlyoutError("Query Error: " + data.error);
            }
            , "complete": function () { xhrRequest = null; }
            , "dataType": "jsonp", "cache": false
            });
        };
    }


    oTable = $('#tbl').dataTable(tableOptions);

    // Attach an event handler to those elements that support launching into Visual
    // the Visual module we want to launch is stored in the 'name' attribute of the element
    if (ie)
    {
        $('#tbl td .cssVisualLink').live('click', function () { LaunchVmx($(this).attr("name"), $(this).attr("item")); });

    }

    // If this inspector supports a details view, add the click handler to open and close the details
    if ("undefined" != typeof (inspector.tableConfig.fnFormatDetails) || "undefined" != typeof (inspector.tableConfig.fnGetDetails))
    {
        $('#tbl td.control').live('click', function ()
        {
            var nTr = this.parentNode;
            var i = $.inArray(nTr, anOpen);

            if (i === -1)
            {
                $('span', this).removeClass('ui-icon-circle-plus').addClass("ui-icon-circle-minus");
                var nDetailsRow = oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
                $('div.innerDetails', nDetailsRow).slideDown(SetWindowHeight);
                anOpen.push(nTr);

            }
            else
            {
                $('span', this).removeClass('ui-icon-circle-minus').addClass("ui-icon-circle-plus");
                $('div.innerDetails', $(nTr).next()[0]).slideUp(function ()
                {
                    oTable.fnClose(nTr);
                    anOpen.splice(i, 1);
                    SetWindowHeight();
                });
            }
        });
    }
});



/////////////////////////////////////////////////////////////////////////////////////
// Sets up the page when a new date or interval is selected.  
// Set g_params.refDate before calling
/////////////////////////////////////////////////////////////////////////////////////
function UpdateDateFilter()
{
    CalculateInterval();    // Calculate start and end dates
    $("#datepicker").datepicker("setDate", g_params.refDate);
    ShowInterval();
    ReloadTable();
}


/////////////////////////////////////////////////////////////////////////////////////
// reload the table (possibly with new filters, etc
/////////////////////////////////////////////////////////////////////////////////////
function ReloadTable()
{
    ClearError();
    ClearWarning();
    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        // load using direct odbc
        oTable.fnClearTable(0);

        // Get the sql we should execute
        var sql = inspector.tableConfig.fnGetSql(inspector.options, g_params);
        
        // get the data for the table
        if (OpenDatabase())
        {
            var data = QueryDatabase("aData", sql);
            CloseDatabase();
            if ("undefined" != typeof (data.error))
            {
                ShowFlyoutError(data.error.description);
            }
            oTable.fnAddData(data.aData, true);
        }
        else
        {
            ShowFlyoutError("Error opening database");
        }
        
        oTable.fnDraw();

    }
    else
    {
        // load from a server
        oTable.fnReloadAjax();
        SetWindowHeight();
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// click handler for the 'previous interval' button
/////////////////////////////////////////////////////////////////////////////////////
function PrevInterval(event)
{
    event.preventDefault();  
    switch (inspector.options.interval)
    {
        case 'day':
        default:
            g_params.refDate.setDate(g_params.refDate.getDate() - 1)
            if (!g_params.refDate.isWeekday()) g_params.refDate.last().friday();
            break;

        case 'week':
            g_params.refDate.setDate(g_params.refDate.getDate() - 7);
            break;

        case 'month':
            g_params.refDate.setMonth(g_params.refDate.getMonth() - 1)
            break;

        case 'quarter':
            g_params.refDate.setMonth(g_params.refDate.getMonth() - 3)
            break;

        case 'year':
            g_params.refDate.setYear(g_params.refDate.getFullYear() - 1)
            break;

    }

    CalculateInterval();
    ShowInterval();
    $("#datepicker").datepicker("setDate", g_params.refDate);
    ReloadTable();
}

/////////////////////////////////////////////////////////////////////////////////////
// click handler for the 'next interval' button
/////////////////////////////////////////////////////////////////////////////////////
function NextInterval(event)
{
    event.preventDefault();
    switch (inspector.options.interval)
    {
        case 'day':
        default:
            g_params.refDate.setDate(g_params.refDate.getDate() + 1);
            if (!g_params.refDate.isWeekday()) g_params.refDate.next().monday();
            break;

        case 'week':
            g_params.refDate.setDate(g_params.refDate.getDate() + 7);
            break;

        case 'month':
            g_params.refDate.setMonth(g_params.refDate.getMonth() + 1)
            break;

        case 'quarter':
            g_params.refDate.setMonth(g_params.refDate.getMonth() + 3)
            break;

        case 'year':
            g_params.refDate.setYear(g_params.refDate.getFullYear() + 1)
            break;

    }

    CalculateInterval();
    ShowInterval();
    $("#datepicker").datepicker("setDate", g_params.refDate);
    ReloadTable();
   
}

function ShowInterval()
{
    var html;

    switch (inspector.options.interval)
    {
        case 'day':
        default:
            var today = new Date().clearTime();
            var tomorrow = new Date().add(1).day().clearTime();
            var yesterday = new Date().add(-1).day().clearTime();
            if (g_params.refDate.equals(today))
                html = LF.today;
            else if (g_params.refDate.equals(tomorrow))
                html = LF.tomorrow;
            else if (g_params.refDate.equals(yesterday))
                html = LF.yesterday;
            else
                html=g_params.refDate.toLocaleDateString();
            break;

        case 'week':
            var nextWeek = Date.today().next().monday().clearTime();
            var thisWeek = nextWeek.clone().addWeeks(-1);
            var lastWeek = thisWeek.clone().addWeeks(-1);

            if (g_params.startDate.equals(thisWeek))
                html = LF.thisWeek;
            else if (g_params.startDate.equals(lastWeek))
                html = LF.lastWeek;
            else if (g_params.startDate.equals(nextWeek))
                html = LF.nextWeek;
            else
                html = LF.weekAbbrev + " " + g_params.startDate.getWeekOfYear() + " (" + g_params.startDate.toString("d MMM yyyy") + ")";
            break;

        case 'month':
            var thisMonth = new Date().moveToFirstDayOfMonth().clearTime();
            var lastMonth = thisMonth.clone().addMonths(-1);
            var nextMonth = thisMonth.clone().addMonths(1);

            if (g_params.startDate.equals(thisMonth))
                html = LF.thisMonth;
            else if (g_params.startDate.equals(lastMonth))
                html = LF.lastMonth;
            else if (g_params.startDate.equals(nextMonth))
                html = LF.nextMonth;
            else
                html = g_params.refDate.toString('MMM yyyy');
            break;

        case 'quarter':
            var thisQuarter = new Date().clearTime();
            thisQuarter.setMonth(Math.floor(new Date().getMonth() / 3) * 3)
            thisQuarter.setDate(1);
            var lastQuarter = thisQuarter.clone().addMonths(-3);
            var nextQuarter = thisQuarter.clone().addMonths(3);

            if (g_params.startDate.equals(thisQuarter))
                html = LF.thisQuarter;
            else if (g_params.startDate.equals(lastQuarter))
                html = LF.lastQuarter;
            else if (g_params.startDate.equals(nextQuarter))
                html = LF.nextQuarter;
            else
                html = "Q" + (Math.floor(g_params.startDate.getMonth() / 3) + 1) + " " + g_params.startDate.getFullYear();
            break;

        case 'year':
            var thisYearNum = new Date().getFullYear();

            switch (thisYearNum - g_params.refDate.getFullYear())
            {
                case 0: html = LF.thisYear; break;
                case -1: html = LF.nextYear; break;
                case 1: html = LF.lastYear; break;
                default: html = g_params.refDate.getFullYear(); break;
            }
            break;
    }
    $("#bannerselector").html( html );
}


/////////////////////////////////////////////////////////////////////////////////////
// Calculate the beginning and ending date filters, based on the chosen interval
// refDate is a Date object, within the period of interest
/////////////////////////////////////////////////////////////////////////////////////
function CalculateInterval(  )
{
    g_params.startDate.setTime(g_params.refDate.getTime());
    g_params.endDate.setTime(g_params.refDate.getTime());

    $("#datepicker").datepicker("option", "showWeek", false);
    $("#datepicker").datepicker("option", "changeMonth", false);
    $("#datepicker").datepicker("option", "changeYear", false);


    switch (inspector.options.interval)
    {
        default:
        case "day":
            $("#datepicker").datepicker( "option", "dateFormat", 'DD, d MM, yy');
            break;

        case "week":
            g_params.startDate.next().monday().addWeeks(-1);
            g_params.endDate = g_params.startDate.clone().addDays(6);
            $("#datepicker").datepicker("option", "dateFormat", 'dd MM, yy');
            $("#datepicker").datepicker("option", "showWeek", true);
            break;

        case "month":
            g_params.startDate.moveToFirstDayOfMonth();
            g_params.endDate.moveToLastDayOfMonth();
            $("#datepicker").datepicker( "option","dateFormat", 'MM, yy');
            $("#datepicker").datepicker("option", "changeMonth", true);
            $("#datepicker").datepicker("option", "changeYear", true);
            break;

        case "quarter":
            g_params.startDate.setMonth(Math.floor(g_params.refDate.getMonth() / 3) * 3);
            g_params.startDate.setDate(1);
            g_params.endDate.setMonth( g_params.startDate.getMonth()+2);  g_params.endDate.moveToLastDayOfMonth();
            $("#datepicker").datepicker("option", "changeMonth", true);
            $("#datepicker").datepicker("option", "changeYear", true);
            break;

        case "year":
            g_params.startDate.setMonth(0); g_params.startDate.setDate(1);
            g_params.endDate.setMonth(11); g_params.endDate.setDate(31);
            $("#datepicker").datepicker( "option","dateFormat", 'yy');
            $("#datepicker").datepicker("option", "changeYear", true);
            break;

        
    }
}
