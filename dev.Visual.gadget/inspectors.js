// This file describes all the inspectors supported by the gadget
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// How to define a new inspector:
// Most of the settings for each inspector are contained in an object that you define in this file.  This section describes the
// mandatory and optional settings for an inspector.  Some of the settings depend on the type of flyout chosen, so if you
// write your own custom flyout window you could end up with different or new settings, beyond what is described here.
//  --- A note about languages:  Most of the text used in the inspectors can be customized for local languages.  To make an alternate language:
//  --- Create a folder under the gadget installation directory that corresponds to the desired language code (eg 'fr' for French).  Refer
//  --- to Windows Sidebar Gadget localization instructions for details.
//  --- Copy the inspector.js and local.js files to that folder.  These contain the text to be translated.
//  --- Translate the text in both of those files (local.js contains text for the gadget itself; inspectors.js contains text
//  --- specific to the inspectors).  In inspectors.js, translate the strings in the LI object below.  Don't translate
//  --- 'internal' strings like array indices or strings in SQL statements, unless you know what you are doing.
//  --- When the gadget is opened on the user's local machine, Windows will use your newly translated files if the language code matches your folder name.
//
//  When designing inspectors, make sure to use localized text (reference the LI object) where possible rather than 
//  embedding the text in the object definition: that makes translation easier!

////------// Each inspector is an object int the g_inspectors array.  The array index is a text name (reference) that must be unique and is never displayed.
//g_inspectors["My Inspector"] =
//{
////------// Name must be the same as the array index (used to reference this inspector object)
//    name: "My Inspector"
////------// Category could be used to group inspectors for easy selection (it isn't right now, but could be in the future)
//    , category: LI.sales
////------// Description could be shown to help the user determine what the inspector is for (it isn't displayed right now, but could be in the future)
//    , description: "Shows some really cool stuff"
////------// shortTitle is shown in the gadget window (the shortTitle, plus the summary data you display needs to fit on one line!)
//    , shortTitle: "Bookings"
////------// flyout determines the flyout window that will be displayed when you double-click an inspector.  The choice of flyout template determines
////------// which additional parameters/options matter (a description of the flyout templates is below, including which inspector elements matter)
//    , flyout: "FlyOutTable.html"
////------// fullWindowURL (optional) if defined, the flyout should provide a hyperlink to this page, which opens in a new window
//    , fullWindowUrl: "http://www.google.com"
////------// fnShortSql returns an SQL statement that retrieves the data for the single-line view in the gadget main window.  The statement can be
////------// customized according to the user's selections (options) for the gadget.  Using column names like 'NUM' and 'AMT' for the results will
////------// let you use the helper functions to format the results in fnRenderShort.  if fnShortSql is not defined, only the shortTitle of the inspector is displayed
//    , fnShortSql: function (options)
//    {
//        if ("SPEC" == options.site)
//            return "SELECT COUNT(DISTINCT CUST_ORDER_ID) as NUM, SUM(AMT_ORDERED_EUR) AS AMT FROM VIEW_CUSTOMER_ORDERS WHERE (IS_REPAIR='No' and IS_VENDOR='No') AND " + WhereDate(options.interval, "ORDER_DATE");
//        else
//            return "SELECT COUNT(DISTINCT CUST_ORDER_ID) as NUM, SUM(AMT_ORDERED) AS AMT FROM VIEW_CUSTOMER_ORDERS_" + options.site + " WHERE (IS_REPAIR='No' and IS_VENDOR='No') AND " + WhereDate(options.interval, "ORDER_DATE");
//    }
////------// fnRenderShort takes the data returned (from the fnShortSql statement) and formats it into a single-line display for the gadget window.
////------// You can reference the inspector's options using this.options.  There are several helper functions defined (RenderSummary...) that help with typical formatting
//    , fnRenderShort: function (data)
//    {
//        var sym = ('ROC' == this.options.site) ? ' $' : ' €';
//        return RenderSummaryNumAndAmtK(this.shortTitle, data, sym);
//    }
////------// the params and options objects contains the user-selectable menus for this inspector.  The flyout window allows the user to select the settings, and the
////------// selected items are saved in the 'options' element of this inspector.  Each parameter/option has a name, and then a list of choices.  The
////------// name (eg 'site' below) needs to be the same for the param and the option (the option.site reflects the currently chosen params.site)
////------// The body of the param (site) is a list of choices (the first is a reference that does not need to be translated; it is used in code only.  The second
////------// is the text displayed to the user for that selection.
////------// Note: FlyoutTable.html allows 'interval' to be selected (with day, week, month, quarter, year as choices) as well as one other parameter.
////------// It applies special processing to the interval (to allow date selection), but the other parameter can be pretty much anything you want the inspector to have.
//    , params:
//    {
//        site: { "SPEC": LI.site_spectracom, "ROC": LI.site_rochester, "LU": LI.site_europe }
//       , interval: { "day": LI.byDay, "week": LI.byWeek, "month": LI.byMonth, "quarter": LI.byQuarter, "year": LI.byYear }
//    }
////------// options saves the current 'params' settings; these are stored persistently (are remembered)
//    , options:
//    {
//        site: 'SPEC'
//        , interval: 'day'
//    }
////------// tableConfig contains the definitions needed to implement a datatable in the flyout (eg FlyoutTable.html)
//    , tableConfig:  //(if needed by flyout)
//    {
////------// fnGetSql returns the SQL statement that should be used to populate the table.  The inspectors options or settings can be used to customize it.
////------// For FlyoutTable.html, the settings include the selected start and end dates if the interval option is used.
//        fnGetSql: function (options, settings)
//        {
//            var table = ("SPEC" == options.site) ? "VIEW_CUSTOMER_ORDERS" : "VIEW_CUSTOMER_ORDERS_" + options.site;
//            var amtField = ("SPEC" == options.site) ? 'AMT_ORDERED_EUR' : 'ANT_ORDERED';
//
//            return "SELECT CUST_ORDER_ID, CUSTOMER_ID, CUSTOMER_NAME, MARKET, "
//            + " APPLICATION, SALES_REP, AMT_ORDERED as AMOUNT, FROM_REGION  "
//            + " FROM " + table
//            + " WHERE (IS_REPAIR='No' and IS_VENDOR='No') AND (ORDER_DATE >= '" + settings.startDate.toString("yyyy-MM-dd") + "' AND ORDER_DATE <= '" + settings.endDate.toString("yyyy-MM-dd") + "')";
//        }
////------// columnConfig describes how the table should be displayed.  refer to datatables.net documentation for proper usage.
////------//    note: mDataProp should correspond to a column name returned from the SQL statement in fnGetSql.
////------//    Consider using the helper functions (Render...) for the fnRender item, to automate display of common data items
//        , columnConfig:
//        [
//            { "mDataProp": "CUST_ORDER_ID", "bSortable": true, "sClass": "cssVisualLink", "sType": "html", "sTitle": LI.id
//                , "fnRender": RenderCustOrderId
//            }
//            , { "mDataProp": "CUSTOMER_NAME", "bSortable": true, "bVisible": true, "sType": "html", "sTitle": LI.customerName, "fnRender": RenderCustomer }
//            , { "mDataProp": "MARKET", "bSortable": true, "bVisible": true, "bSearchable": true, "sType": "string", "sTitle": LI.market }
//            , { "mDataProp": "FROM_REGION", "bSortable": true, "bVisible": true, "sType": "string", "sTitle": LI.region }
//            , { "mDataProp": "APPLICATION", "bSortable": true, "bVisible": false, "sType": "string", "sTitle": LI.application }
//            , { "mDataProp": "SALES_REP", "bSortable": false, "bVisible": false, "sType": "string", "sTitle": LI.salesRep }
//            , { "mDataProp": "AMOUNT", "bSortable": true, "bVisible": true, "sClass": "right", "sType": "numeric", "sTitle": LI.amount
//                , "fnRender": RenderAmount, "bUseRendered": false
//            }
//        ]
////------// (optional) if totals is defined, an extra row is added to the table that includes totals (you define the formatting in fnRender)
//        , totals: [{ column: 'AMOUNT', position: 4, type: 'sum', sClass: "right", fnRender: function (total, options) { return RenderMoney(total, 2, ('ROC' == options.site) ? '$' : '€'); } }]
////------// fnSqlDetails: (optional) if this is defined, an extra column is added to the table containing an open/close function, that allows details for that row to be
////------// displayed.  when the user 'opens' the details, the table will ask for an sql statement to execute, which depends on the row, as well as the inspector's options and settings
//        , fnSqlDetails: function (rowData, options, settings)
//        {
//            return "SELECT ORDER_DATE, CUSTOMER_NAME, SALES_MGR, QTY_ORDERED FROM VIEW_CUST_ORDERS WHERE (IS_REPAIR='No' and IS_VENDOR='No' and IS_INTERCOMPANY='No') AND PRODUCT_CODE='GPS SIMULATORS'"
//                    + " AND COMMODITY_CODE='" + rowData.COMMODITY_CODE + "'"
//                    + " AND (ORDER_DATE >= '" + settings.startDate.toString("yyyy-MM-dd") + "' AND ORDER_DATE <= '" + settings.endDate.toString("yyyy-MM-dd") + "')"
//
//        }
////------// This formats the information returned by fnSqlDetails, into HTML that is displayed in the details.
//        , fnFormatDetails: function (data, options, params)
//        {
//            //var sOut = (data.d.length > 0)? "": LI.noDetailAvailable;
//            var sOut = "<table>";
//            for (var i = 0; i < data.d.length; i++)
//            {
//                sOut += "<tr>";
//                for (key in data.d[i])
//                    sOut += "<td>" + data.d[i][key] + "</td>";
//                sOut += "</tr>";
//            }
//            sOut += "</table>";
//            return sOut;
//        }
//    }
//};


//--------------------------------------------//---------------------------------------------------
// If the access to the SQL server is via a web server, set up this section

/*
var L_VIS_URL_BASE = "http://vis.my.company.com/";
var L_JSON_QUERY_URL = L_VIS_URL_BASE + "util/vqueryjson.aspx";
var L_JSON_TABLE_URL = L_VIS_URL_BASE + "util/xhr.aspx";
var L_JSON_SHIPMENT_URL = L_VIS_URL_BASE + "util/trackShipment.aspx";

var L_WEB_SERVER_ROOT = "http://my.company.com";

var config =
{
server: 'sql.my.company.com',
database: 'vmfg'
};
*/

// Otherwise, set up 'direct' access using Windows database support:
// The connection string specifies how you connect to the database.  examples:
//var L_CONNECTION_STRING = "driver={SQL Server};server=myserver;database=vmfg;Trusted_Connection=Yes"
var L_CONNECTION_STRING = "you need something here!!!"


// These are strings used in the inspectors
var LI =
{
    amount: "Amount"
    ,application: "Application"
    , bol: "BOL"
    , budget: "Budget"
    , bunit: "Unit"
    , byDay: 'By Day'
    , byMonth: 'By Month'
    , byQuarter: "By Quarter"
    , byWeek: 'By Week'
    , byYear: 'By Year'
    , cancelled: 'Canceled'
    , class_: 'Class'
    , closed: 'Closed'
    , code: 'Code'
    , commodity: "Commodity"
    , conversion: "Conversion"
    , current: "Current"
    , cost: "Cost"
    , customerId: "Customer ID"
    , customerName: "Customer"
    , date: "Date"
    , deptEngineering: "Engineering"
    , deptOperations: "Operations"
    , description: "Description"
    , destination: "Destination"
    , dueDate: "Due"
    , eccn: "ECCN"
    , eurosBudget: "Euros @Budget"
    , exportRating: "Rating"
    , finance: 'Finance'
    , firstPass: "First Pass"
    , firmed: "Firm"
    , fob: "FOB"
    , general: 'General'
    , hours: "Hours"
    , htsCode: "HTS-Code"
    , id: "Id"
    , invoice: "Invoice"
    , late: "Late"
    , line: "Line"
    , location: "Location"
    , lot: "Lot"
    , market: "Market"
    , metric: "Metric"
    , name: "Name"
    , noDetailAvailable: "No Detail Available"
    , notes: "Notes"
    , onTime: "On Time"
    , operations: "Operations"
    , orderId: 'Order ID'
    , packlist: "Packlist"
    , partId: "Part ID"
    , passed: "Passed"
    , po: "PO"
    , poReference: "Reference"
    , product: "Product"
    , promised: "Promised"
    , project: "Project"
    , purchased: "Purch"
    , qty: 'Qty'
    , recvDate: "Recv Date"
    , region: "Region"
    , released: "Released"
    , sales: "Sales"
    , salesRep: "Sales/Rep"
    , serialNo: "Serial#"
    , shipDate: "Ship Date"
    , shipVia: "Ship Via"
    , site_3: "Site3"
    , site_1: "Site1"
    , site_2: "Site2"
    , spot: "Spot"
    , status: "Status"
    , terms: "Terms"
    , timeInMinutes: "Minutes"
    , to: "To"
    , type: "Type"
    , urgent: "Urgent"
    , username: 'Username'
    , vendor: "Vendor"
    , vendorId: "Vendor ID"
    , vendorName: "Vendor Name"
    , vendorPart: "Vendor Part"
    , warehouse: "Warehouse"
    , waybill: "Waybill"
    , year: "Year"
};


//--------------------------------------------//---------------------------------------------------

// Holds the definitions of the inspectors
var g_inspectors = new Array;


// Find out the correct thousands and decimal separators based on computer's locale settings
// these are used to format numbers
var g_thousands = (1000).toLocaleString().substring(1, 2);
var g_decimal = (1.1).toLocaleString().substring(1, 2);


/////////////////////////////////////////////////////////////////////////////////////
// Builds a where clause for the specified date field
/////////////////////////////////////////////////////////////////////////////////////
function WhereDate(interval, field)
{   
    // Return a where clause covering the current date in the specified interval.
    switch (interval)
    {
        case 'year':
            return WhereYear(field, new Date());
        case 'quarter':
            return WhereQuarter(field, new Date());
        case 'month':
            return WhereMonth(field, new Date());
        case 'week':
            return WhereWeek(field, new Date());
        case 'day':
        default:
            return WhereDay(field, new Date());
    }
}
function WhereYear(field, d) { return "(YEAR("+field+")=" + d.getFullYear() + ")"; }
function WhereQuarter(field, d) { return "(datepart(qq," + field + ")=" + parseInt((d.getMonth() + 3) / 3) + ")AND(YEAR(" + field + ")=" + d.getFullYear() + ")"; }
function WhereMonth(field, d) { return "(MONTH(" + field + ")=" + (d.getMonth() + 1) + ")AND(YEAR(" + field + ")=" + d.getFullYear() + ")"; }
function WhereWeek(field, d) { return "CONVERT (date, " + field + ")='" + d.format("isoDate") + "'"; }
function WhereDay(field, d) { return "CONVERT (date, " + field + ")='" + d.format("isoDate") + "'"; }


/////////////////////////////////////////////////////////////////////////////////////
// Wraps the str in an HTML span that causes it to be right justified
/////////////////////////////////////////////////////////////////////////////////////
function JustifyRight(str)
{
    return "<span class='rightcol' style='right: 0;'>" + str + "</span>"
}

/////////////////////////////////////////////////////////////////////////////////////
// Generate 1-line HTML string representing the NUM field of the inspector data
/////////////////////////////////////////////////////////////////////////////////////
function RenderSummaryNum(data) {
    var num = 0;
    if( data.d.length > 0 ) num = (null == data.d[0].NUM) ? 0 : parseInt(data.d[0].NUM);
    return this.shortTitle + JustifyRight(num);
}


/////////////////////////////////////////////////////////////////////////////////////
// Generate 1-line HTML string representing the NUM/DENOM field as a percentage
/////////////////////////////////////////////////////////////////////////////////////
function RenderSummaryPercent(data) 
{
    var num = 0, denom = 1;
    if (data.d.length > 0) 
    {
        num = (null == data.d[0].NUM) ? 0 : parseInt(data.d[0].NUM);
        denom = (null == data.d[0].DENOM) ? 0 : parseInt(data.d[0].DENOM);
    }

    return this.shortTitle + JustifyRight((num*100/denom).toFixed(0) + "%") ;
}

/////////////////////////////////////////////////////////////////////////////////////
// Generate 1-line HTML string representing the NUM and AMT fields in K
/////////////////////////////////////////////////////////////////////////////////////
function RenderSummaryNumAndAmtK(title, data, symbol)
{
    var suffix = "";
    var curr = 0;
    var num = 0;
    if (data.d.length > 0) 
    {
        curr = (null == data.d[0].AMT) ? 0.0 : parseInt(data.d[0].AMT);
        num = (null == data.d[0].NUM) ? 0 : parseInt(data.d[0].NUM);
    }
    if (curr > 10000000)    // greater than 10M, show as millions
    {
        suffix = "M"; curr = (curr / 1000000);
    }
    else if (curr > 1000)
    {
        suffix = "K"; curr = (curr / 1000);
    }
    return title + JustifyRight(num + symbol + curr.toFixed(0) + suffix);
}

/////////////////////////////////////////////////////////////////////////////////////
// Generate 1-line HTML string representing the NUM and AMT ($) fields inspector data
/////////////////////////////////////////////////////////////////////////////////////
function RenderSummaryNumAndDollars(data)
{
    var suffix = "";
    var curr = 0;
    var num = 0;
    if (data.d.length > 0) 
    {
        curr = (null == data.d[0].AMT) ? 0.0 : parseInt(data.d[0].AMT);
        num = (null == data.d[0].NUM) ? 0 : parseInt(data.d[0].NUM);
    }
    if (curr > 1000000) 
    {
        suffix = "M";  curr = (curr/1000000);
    } 
    else if (curr > 1000)  
    {
        suffix = "K"; curr = (curr / 1000);
    }
    return this.shortTitle + JustifyRight(num + " $" + curr.toFixed(0) + suffix);
}

/////////////////////////////////////////////////////////////////////////////////////
// Formats the AMOUNT field as money, using the localized number format and 2 decimals
/////////////////////////////////////////////////////////////////////////////////////
function RenderAmount(oObj )
{
    var n=(oObj.aData.AMOUNT== undefined ? 0 : oObj.aData.AMOUNT);
    return formatNumber(n, 2, g_thousands, g_decimal, "", "", '(', ')');
};

/////////////////////////////////////////////////////////////////////////////////////
// Formats a number as money, using the localized number format and number of decimals
/////////////////////////////////////////////////////////////////////////////////////
function RenderMoney(amt, decimals, currency)
{
    amt = ('number' != typeof (amt)) ? 0 : amt;
    return formatNumber(amt, decimals, g_thousands, g_decimal, currency, "", '(', ')');
};

/////////////////////////////////////////////////////////////////////////////////////
// Renders a date field of the flyout data 
/////////////////////////////////////////////////////////////////////////////////////
function RenderDate(theDate, bShowLate)
{
    bShowLate = (typeof bShowLate === "undefined") ? false : bShowLate;
    if (theDate)
    {
        var d = new Date(parseInt(theDate.substr(6)));
        if (bShowLate && d < new Date())
        {
            return "<span style='color: red;'>" + dateFormat(d) + "</span>";
        }
        else
            return dateFormat(d);
    }
    return "";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders a date field of the flyout data 
/////////////////////////////////////////////////////////////////////////////////////
function RenderDateWithColor(theDate, color)
{
    if (theDate)
    {
        var d = new Date(parseInt(theDate.substr(6)));
            return "<span style='color: " + color + ";'>" + dateFormat(d) + "</span>";
    }
    return "";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders a shipping waybill (future)
/////////////////////////////////////////////////////////////////////////////////////
function RenderWaybill( shipVia, waybill )
{
    return waybill;
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the part id field of the flyout data to open material planning
/////////////////////////////////////////////////////////////////////////////////////
function RenderPartIdPlanning(oObj)
{
    if (null == oObj.aData.PART_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMPLNWIN' item='" + oObj.aData.PART_ID +"'>" + oObj.aData.PART_ID + "</span>"; 
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the part id field of the flyout data to open in part maintenance
/////////////////////////////////////////////////////////////////////////////////////
function RenderPartIdMaint(oObj)
{
    if (null == oObj.aData.PART_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMPRTMNT' item='" + oObj.aData.PART_ID + "'>" + oObj.aData.PART_ID + "</span>";
}


/////////////////////////////////////////////////////////////////////////////////////
// Renders the work order field of the flyout data to open the mfg window
/////////////////////////////////////////////////////////////////////////////////////
function RenderWorkOrder(oObj)
{
    if (null == oObj.aData.BASE_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMMFGWIN' item='W~" + oObj.aData.BASE_ID + "~" + oObj.aData.LOT_ID + "~0~~" + oObj.aData.BASE_ID + "~" + "'>" + oObj.aData.BASE_ID + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the work order field of the flyout data to open the mfg window
/////////////////////////////////////////////////////////////////////////////////////
function RenderLaborEntry(oObj)
{
    return "<span class='cssVisualLink' name='VMLABENT' item=''>" + oObj.aData.WORKORDER_ID + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the po id  field of the flyout data to open the purchasing window
/////////////////////////////////////////////////////////////////////////////////////
function RenderPurchaseOrder(oObj)
{
    if (null == oObj.aData.PO_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMPURENT' item='" + oObj.aData.PO_ID + "'>" + oObj.aData.PO_ID + "</span>";
}


/////////////////////////////////////////////////////////////////////////////////////
// Renders the receiver id  field of the flyout data to open the receiver window
/////////////////////////////////////////////////////////////////////////////////////
function RenderReceiver(oObj)
{
    if (null == oObj.aData.RECEIVER_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMRCVENT' item='" + oObj.aData.RECEIVER_ID + "'>" + oObj.aData.RECEIVER_ID + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the customer order id  field of the flyout data to open the order window
/////////////////////////////////////////////////////////////////////////////////////
function RenderCustOrderId(oObj)
{
    if (null == oObj.aData.CUST_ORDER_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMORDENT' item='" + oObj.aData.CUST_ORDER_ID + "'>" + oObj.aData.CUST_ORDER_ID + "</span>";
}
function RenderOrderId( order, text )
{
    text = (typeof text === "undefined") ? order : text;
   if (null == order)
        return "";
    else
        return "<span class='cssVisualLink' name='VMORDENT' item='" + order + "'>" +text + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the customer id  field of the flyout data to open the customer window
/////////////////////////////////////////////////////////////////////////////////////
function RenderCustomer(oObj)
{
    if (null == oObj.aData.CUSTOMER_ID || null == oObj.aData.CUSTOMER_NAME)
        return "";
    else
        return oObj.aData.CUSTOMER_NAME;
        // Visual seems to have a bug; puts the customer id in the name field.  not sure how to work around
  //  return "<span class='cssVisualLink' name='VMCUSMNT' item='" + oObj.aData.CUSTOMER_ID + "'>" + oObj.aData.CUSTOMER_NAME + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the vendor id  field of the flyout data to open the vendor maintenance window
/////////////////////////////////////////////////////////////////////////////////////
function RenderVendor(oObj)
{
    if (null == oObj.aData.VENDOR_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMVNDMNT' item='" + oObj.aData.VENDOR_ID + "'>" + oObj.aData.VENDOR + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the packlist id  field of the flyout data to open the shipping window
/////////////////////////////////////////////////////////////////////////////////////
function RenderPacklist(oObj)
{
    if (null == oObj.aData.PACKLIST_ID)
        return "";
    else
        return "<span class='cssVisualLink' name='VMSHPENT' item='" + oObj.aData.PACKLIST_ID + "'>" + oObj.aData.PACKLIST_ID + "</span>";
}


/////////////////////////////////////////////////////////////////////////////////////
// Renders the invoice id  field of the flyout data to open the invoice window
/////////////////////////////////////////////////////////////////////////////////////
function RenderInvoice(inv)
{
    if (null == inv)
        return "";
    else
        return "<span class='cssVisualLink' name='VFARIENT' item='" + inv + "'>" +inv + "</span>";
}

/////////////////////////////////////////////////////////////////////////////////////
// Renders the data array into a simple HTML table
/////////////////////////////////////////////////////////////////////////////////////
function RenderTable(aData, headings)
{
    var html = "<table class='cssSimpleTable'>"
    if( "undefined" != typeof(headings))
    {
        html += "<thead><tr>"
        $.each(headings, function (index,value) { html += "<th>" + value + "</th>" });
        html += "</tr></thead>"
    }

    html += "<tbody>"
    $.each(aData, function (index, row)
    {
        html += "<tr>"
        $.each(row, function (k, v) { html += "<td>" + v + "</td>"; });
        html += "</tr>"
    });
    html += "</tbody></table>"
    return html;
}


/////////////////////////////////////////////////////////////////////////////////////
// Attempt to get shipment details and open in a details row
/////////////////////////////////////////////////////////////////////////////////////
function GetShipmentDetails(oTable, nTr)
{
    var oData = oTable.fnGetData(nTr);

    // if the waybill and ship via are not null, and the ship via at least has the letters UPS,
    // we will assume it's a UPS tracking number
    if (null !== oData.SHIP_VIA && null !== oData.WAYBILL_NUMBER && -1 !== oData.SHIP_VIA.search("UPS"))
    {

        // try to retrieve the shipment status through the web server

        $.ajax(
	    {
	        type: 'GET'
	        , url: L_JSON_SHIPMENT_URL
	        , dataType: "jsonp"
	        , cache: false
	        , data:
		    {
		        carrier: encodeURIComponent("UPS")
		        , inquiry: encodeURIComponent(oData.WAYBILL_NUMBER)
		    }
	        , success: function (data, textStatus, jqXHR)
	        {
	            if (data.Message > "")
	            {
	                // some sort of error occurred
	                $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', data.Message);
	                document.body.style.height = $(document).height();
	            }
	            else if (data.ServerData.Response.ResponseStatus.Code != 1)
	            {
	                // UPS remote service reported an error
	                $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', "UPS Service Response: " + data.ServerData.Response.ResponseStatus.Description);
	                document.body.style.height = $(document).height();
	            }
	            else
	            {

	                // Received a response, display it
	                var html = "<span>" + "UPS " + data.ServerData.Shipment[0].Service.Description + "</span></br>";
	                html += "Tracking Number: <a href='http://www.ups.com/tracking/tracking.html'>" + oData.WAYBILL_NUMBER + "</a></br>";
	                html += "Packages:</br>";
	                $.each(data.ServerData.Shipment[0].Package, function (index, row)
	                {
	                    html += index + ":";

	                    try
	                    {
	                        // weight of package
	                        if (null != row.PackageWeight.Weight && null !== row.PackageWeight.UnitOfMeasurement.Code)
	                            html += " (" + row.PackageWeight.Weight + " " + row.PackageWeight.UnitOfMeasurement.Code + ")";

	                        if (null != row.Activity[0].Status.Description && null !== row.Activity[0].Date && null !== row.Activity[0].Time)
	                        {
	                            var d = row.Activity[0].Date;
	                            html += " Last Activity: " + row.Activity[0].Status.Description + " ";
	                            html += d.substring(0, 4) + "-" + d.substring(4, 6) + "-" + d.substring(6) + " ";
	                            d = row.Activity[0].Time;
	                            html += d.substring(0, 2) + ":" + d.substring(2, 4) + ":" + d.substring(4) + " ";
	                        }

	                        if (null != row.Activity[0].ActivityLocation.Address.City)
	                            html += " in " + row.Activity[0].ActivityLocation.Address.City;

	                        if (null != row.Activity[0].ActivityLocation.Description)
	                            html += " at " + row.Activity[0].ActivityLocation.Description;

	                        if (null != row.Activity[0].ActivityLocation.SignedForByName)
	                            html += " by " + row.Activity[0].ActivityLocation.SignedForByName;

	                        html += "</br>";
	                    }
	                    catch (e)
	                    {
	                        $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', e.description);
	                        document.body.style.height = $(document).height();
	                    }

	                });

	                $('div.innerDetails', $(nTr).next()[0]).html(html);
	                document.body.style.height = $(document).height();
	            }
	        }
            , error: function (jqXHR, textStatus, errorThrown)
            {
                $('div.innerDetails', $(nTr).next()[0]).html(LF.serverError).attr('title', errorThrown);
                document.body.style.height = $(document).height();
            }
	    });

        return '<div class="innerDetails"><span style="width:100%; text-align: center;">' + LF.loading + "</span></div>";
    }
    else
    {
        return '<div class="innerDetails"><span style="width:100%; text-align: center;">' + L_NO_INFO_AVAILABLE + "</span></div>";
    }

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// A blank inspector: used for any positions that don't have a real inspector
g_inspectors["Separator"] = 
{
    name: "Separator"
    , description: "Blank"
    , category: LI.general
    , shortTitle: ""
    , flyout: ""
    , shortSql: []
    , fnRenderShort: function (data) { }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ActiveLogins displays the number of users logged into Visual
g_inspectors["ActiveLogins"] =
{
    name: "ActiveLogins"
    , description: "Active Logins"
    , category: LI.general
    , shortTitle: "Active Logins"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options)
    {
        return "SELECT COUNT(USER_ID) as NUM FROM LOGINS WHERE (PROGRAM_ID = 'MENU')";
    }
    , fnRenderShort: RenderSummaryNum
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            return "SELECT USER_ID AS USERNAME, DATEDIFF(ss, LOGIN_TIME, getdate() )  / 60 AS TIME_IN_MINUTES" 
                + " FROM LOGINS WHERE (PROGRAM_ID = 'MENU')";
        }
        , columnConfig:
        [
                { "mDataProp": "USERNAME", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.username }
            , { "mDataProp": "TIME_IN_MINUTES", "bSortable": true, "sClass": "center", "sType": "numeric", "sTitle": LI.timeInMinutes }
        ]
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OpenWorkOrders displays information about the number of open work orders
g_inspectors["OpenWorkOrders"] =
{
    name: "OpenWorkOrders"
    , category: LI.operations
    , description: "Open Work Orders"
    , shortTitle: "Open Work Orders"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options) { return "SELECT COUNT(BASE_ID) as NUM FROM WORK_ORDER WHERE STATUS = 'R'"; }
    , fnRenderShort: RenderSummaryNum
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            return "SELECT BASE_ID, LOT_ID, PART_ID, DESIRED_QTY-RECEIVED_QTY AS OPEN_QTY,DESIRED_WANT_DATE"
                + " FROM WORK_ORDER WHERE STATUS = 'R'";
        }
        , columnConfig:
        [
            { "mDataProp": "BASE_ID", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.id, "fnRender": RenderWorkOrder, "bUseRendered": false }
            , { "mDataProp": "LOT_ID", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.lot }
            , { "mDataProp": "PART_ID", "bSortable": true, "sClass": "center", "bVisible": true, "sType": "string", "sTitle": LI.partId, "fnRender": RenderPartIdPlanning, "bUseRendered": false }
            , { "mDataProp": "OPEN_QTY", "bSortable": true, "sClass": "center", "sType": "numeric", "sTitle": LI.qty }
            , { "mDataProp": "DESIRED_WANT_DATE", "bSortable": true, "sClass": "center", "sType": "date", "sTitle": LI.dueDate
                , "fnRender": function (oObj) { return RenderDate(oObj.aData.DESIRED_WANT_DATE); }
                , "bUseRendered": true
            }
        ]
    }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WoNotPrinted displays information about open work orders that have not been printed yet
g_inspectors["WoNotPrinted"] =
{
    name: "WoNotPrinted"
    , category: LI.operations
    , description: "Workorders To Print"
    , shortTitle: "WO To Print"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options) { return "SELECT COUNT(DISTINCT BASE_ID) as NUM FROM WORK_ORDER WHERE (STATUS in ('R','F')) and (PART_ID IS NOT NULL) and (PRINTED_DATE is NULL)"; }
    , fnRenderShort: RenderSummaryNum
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            return "SELECT BASE_ID, LOT_ID, PART_ID, (DESIRED_QTY-RECEIVED_QTY) as OPEN_QTY,DESIRED_WANT_DATE, STATUS"
                + " FROM WORK_ORDER WHERE (STATUS in ('R','F')) and (PART_ID IS NOT NULL) and (PRINTED_DATE is NULL)";
        }
        , columnConfig:
        [
            { "mDataProp": "BASE_ID", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.id, "fnRender": RenderWorkOrder, "bUseRendered": false }
            , { "mDataProp": "LOT_ID", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.lot }
            , { "mDataProp": "PART_ID", "bSortable": true, "sClass": "center", "bVisible": true, "sType": "string", "sTitle": LI.partId, "fnRender": RenderPartIdPlanning, "bUseRendered": false }
            , { "mDataProp": "OPEN_QTY", "bSortable": true, "sClass": "center", "sType": "numeric", "sTitle": LI.qty }
            , { "mDataProp": "DESIRED_WANT_DATE", "bSortable": true, "sClass": "center", "sType": "date", "sTitle": LI.dueDate
                , "fnRender": function (oObj) { return RenderDate(oObj.aData.DESIRED_WANT_DATE); }
                , "bUseRendered": true
            }
            , { "mDataProp": "STATUS", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.status }
        ]
    }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bookings displays information about customer orders entered in a given interval
g_inspectors["Bookings"] =
{
    name: "Bookings"
    , category: LI.sales
    , description: "Bookings"
    , shortTitle: "Bookings"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options)
    {
        return "SELECT COUNT( ID) as NUM, SUM(co.TOTAL_AMT_ORDERED * co.SELL_RATE) AS AMT FROM CUSTOMER_ORDER co WHERE " + WhereDate
        (options.interval, "ORDER_DATE");
    }
    , fnRenderShort: function (data)
    {
        return RenderSummaryNumAndAmtK(this.shortTitle, data, " $");
    }
    , params:
    {
        interval: { "day": LI.byDay, "week": LI.byWeek, "month": LI.byMonth, "quarter": LI.byQuarter, "year": LI.byYear }
    }
    , options:
    {
        interval: 'day'
    }
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            var from = "CUSTOMER_ORDER AS co LEFT OUTER JOIN CUSTOMER AS c ON co.CUSTOMER_ID = c.ID";

            return "SELECT co.ID as CUST_ORDER_ID, co.CUSTOMER_ID, c.NAME as CUSTOMER_NAME, "
            + " (co.TOTAL_AMT_ORDERED * co.SELL_RATE) as AMOUNT "
            + " FROM " + from
            + " WHERE (ORDER_DATE >= '" + settings.startDate.toString("yyyy-MM-dd") + "' AND ORDER_DATE <= '" + settings.endDate.toString("yyyy-MM-dd") + "')";
        }
        , columnConfig:
        [
            { "mDataProp": "CUST_ORDER_ID", "bSortable": true, "sClass": "cssVisualLink", "sType": "html", "sTitle": LI.id
                , "fnRender": RenderCustOrderId
            }
            , { "mDataProp": "CUSTOMER_NAME", "bSortable": true, "bVisible": true, "sType": "html", "sTitle": LI.customerName, "fnRender": RenderCustomer, "bUseRendered": false }
            , { "mDataProp": "AMOUNT", "bSortable": true, "bVisible": true, "sClass": "right", "sType": "numeric", "sTitle": LI.amount
                , "fnRender": RenderAmount, "bUseRendered": false
            }
        ]
        , totals: [{ column: 'AMOUNT', position: 2, type: 'sum', sClass: "right", fnRender: function (total, options) { return RenderMoney(total, 2, '$'); } }]
    }
};




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Displays any parts that are showing a negative on hand balance
g_inspectors["NegOnHand"] =
{
    name: "NegOnHand"
    , description: "Negative On Hand"
    , category: LI.general
    , shortTitle: "Negative On Hand"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options) { return "SELECT COUNT(*) AS NUM FROM PART WHERE QTY_ON_HAND<0 "; }
    , fnRenderShort: RenderSummaryNum
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            return "SELECT ID as PART_ID, DESCRIPTION, PRODUCT_CODE, COMMODITY_CODE, QTY_ON_HAND, PURCHASED FROM PART WHERE QTY_ON_HAND < 0 ";
        }
        , columnConfig:
        [
            { "mDataProp": "PART_ID", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.partId, "fnRender": RenderPartIdPlanning }
            , { "mDataProp": "DESCRIPTION", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.description }
            , { "mDataProp": "PRODUCT_CODE", "bSortable": true, "bVisible": false, "sType": "string", "sTitle": LI.product }
            , { "mDataProp": "COMMODITY_CODE", "bSortable": true, "bVisible": false, "sType": "string", "sTitle": LI.commodity }
            , { "mDataProp": "QTY_ON_HAND", "bSortable": true, "sClass": "center", "sType": "numeric", "sTitle": LI.qty }
            , { "mDataProp": "PURCHASED", "bSortable": true, "sClass": "center", "sType": "string", "sTitle": LI.purchased }
        ]
    }
};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Displays receivers (purchase order receipts)
g_inspectors["Receivers"] =
{
    name: "Receivers"
    , description: "PO Receivers"
    , category: LI.operations
    , shortTitle: "PO Receivers"
    , flyout: "FlyOutTable.html"
    , fnShortSql: function (options)
    {
        return "SELECT COUNT( ID ) AS NUM FROM RECEIVER WHERE " + WhereDate(options.interval, "RECEIVED_DATE");
    }
    , fnRenderShort: RenderSummaryNum
    , params:
    {
        interval: { "day": LI.byDay, "week": LI.byWeek, "month": LI.byMonth, "quarter": LI.byQuarter, "year": LI.byYear }
    }
    , options:
    {
        interval: 'day'
    }
    , tableConfig:
    {
        fnGetSql: function (options, settings)
        {
            return "SELECT r.ID as RECEIVER_ID, r.PURC_ORDER_ID as PO_ID, r.RECEIVED_DATE, v.ID as VENDOR_ID, v.NAME as VENDOR FROM "
            + " RECEIVER r "
            + "INNER JOIN PURCHASE_ORDER as po ON r.PURC_ORDER_ID = po.ID "
            + "INNER JOIN VENDOR as v ON po.VENDOR_ID = v.ID "
            + " WHERE (RECEIVED_DATE >= '" + settings.startDate.toString("yyyy-MM-dd") + "' AND RECEIVED_DATE <= '" + settings.endDate.toString("yyyy-MM-dd") + "')";
        }
        , columnConfig:
        [
              { "mDataProp": null, "bSortable": false, "bSearchable": false, "sClass": "control center", "sDefaultContent": '<span class="ui-icon ui-icon-circle-plus">' }
            , { "mDataProp": "RECEIVED_DATE", "bSortable": true, "bVisible": true, "sType": "date", "sTitle": LI.recvDate, "fnRender": function (oData) { return RenderDate(oData.aData.RECEIVED_DATE); } }
            , { "mDataProp": "RECEIVER_ID", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.id, "fnRender": RenderReceiver, "bUseRendered": false }
            , { "mDataProp": "PO_ID", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.po, "fnRender": RenderPurchaseOrder, "bUseRendered": false }
            , { "mDataProp": "VENDOR_ID", "bSortable": false, "bVisible": false, "sType": "string", "sTitle": LI.vendorId }
            , { "mDataProp": "VENDOR", "bSortable": true, "sClass": "left", "sType": "string", "sTitle": LI.vendorName, "fnRender": RenderVendor, "bUseRendered": false }
        ]
        , fnSqlDetails: function (rowData, options, settings)
        {
            return "SELECT rl.LINE_NO, rl.RECEIVED_QTY, COALESCE(rl.WAREHOUSE_ID, ''), coalesce(pl.VENDOR_PART_ID, '') as VENDOR_PART_ID, coalesce(pl.PART_ID,'') as PART_ID "
                + " FROM RECEIVER_LINE rl"
                + " INNER JOIN PURC_ORDER_LINE as pl ON rl.PURC_ORDER_ID = pl.PURC_ORDER_ID AND rl.PURC_ORDER_LINE_NO = pl.LINE_NO "
                + "	WHERE rl.RECEIVER_ID='" + rowData.RECEIVER_ID + "' ORDER BY rl.LINE_NO";
        }
        , fnFormatDetails: function (data, options, settings)
        {
            if (data.aData.length == 0)
                return LI.noDetailAvailable;
            else
            {
                return RenderTable(data.aData, [LI.line, LI.qty, LI.warehouse, LI.vendorPart, LI.partId]);
            }

        }

    }
};



