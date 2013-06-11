/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2011 Spectracom Corporation
// All Rights Reserved
//
// Holds miscellaneous functions that will be helpful to use on various pages



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions to show and clear the error banner.  Set the message text and show the message bar
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ShowError(html)
{
    $('#txtError').html(html);
    if ($('#divError').is(':hidden'))
      $('#divError').show('blind');
}
function ClearError()
{
    $("#divError").hide();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions to show and clear the warning banner.  Set the message text and show the message bar
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ShowWarning(html)
{
    $('#txtWarning').html(html);
    $('#divWarning').show('blind');
}
function ClearWarning()
{
    $("#divWarning").hide();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Default handler for ajax errors
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AjaxError(x, e)
{
    if (x.status == 0)
    {
        ShowError('You are offline!! Please Check Your Network.');
    } else if (x.status == 404)
    {
        ShowError('Requested URL not found.');
    } else if (x.status == 500)
    {
        ShowError('Internal Server Error.');
    } else if (e == 'parsererror')
    {
        ShowError('Error. Parsing JSON Request failed.');
    } else if (e == 'timeout')
    {
        ShowError('Request Time out.');
    } else
    {
        ShowError('Unknown Error: ' + x.responseText);
    }
}

// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
//     ie === undefined
// If you're in IE (>=5) then you can determine which version:
//     ie === 7; // IE7
// Thus, to detect IE:
//     if (ie) {}
// And to detect the version:
//     ie === 6 // IE6
//     ie > 7 // IE8, IE9 ...
//     ie < 9 // Anything less than IE9
// ----------------------------------------------------------
// UPDATE: Now using Live NodeList idea from @jdalton
var ie = (function ()
{

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

} ());


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// replace null values with non-breaking space
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nbsp(s)
{
    if (undefined == s)
        return "&nbsp";
    else
        return s;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// formats a currency value as a string
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function formatCurrency(num, currency)
{
    num = isNaN(num) || num === '' || num === undefined ? 0.00 : num;
    return currency + " " + parseFloat(num).toFixed(2);
}


/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/
var dateFormat = function ()
{
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len)
		{
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc)
    {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date))
        {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:")
        {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0)
        {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "yyyy-mm-dd",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc)
{
    return dateFormat(this, mask, utc);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Writes a Visual VMX file and launches it. If the Visual/PC environment is set up correctly this should open the visual UI to the specified module
// THis only works with internet explorer
// module is the name of a Visual EXE (like 'VMPURENT')
// parameter is a string that depends on the module (for purchase order entry, it can be the ID of the purchase order to be opened)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function LaunchVmx(module, parameter)
{
    var sTempFile = new ActiveXObject("Scripting.FileSystemObject").GetSpecialFolder(2);
    sTempFile += "\\" + module + ".vmx";

    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var ts = fso.OpenTextFile(sTempFile, 2, true)
    ts.WriteLine("LSASTART");
    ts.WriteLine(module + "~" + parameter);
    ts.Close();

    var shell = new ActiveXObject("Wscript.Shell");
    return shell.Run(sTempFile);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creates a link to salesforce.com that opens the item
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SalesForceLink(item)
{
    return 'https://na8.salesforce.com/' + item;
}


/*!
* jQuery.parseJSON() extension (supports ISO & Asp.net date conversion)
*
* Version 1.0 (13 Jan 2011)
*
* Copyright (c) 2011 Robert Koritnik
* Licensed under the terms of the MIT license
* http://www.opensource.org/licenses/mit-license.php
*/
(function ($)
{
    // JSON RegExp
    var rvalidchars = /^[\],:{}\s]*$/;
    var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
    var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
    var dateNet = /\/Date\((\d+)(?:-\d+)?\)\//i;
    // replacer RegExp
    var replaceISO = /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?Z"/i;
    var replaceNet = /"\\\/Date\((\d+)(?:-\d+)?\)\\\/"/i;
    // determine JSON native support
    var nativeJSON = (window.JSON && window.JSON.parse) ? true : false;
    var extendedJSON = nativeJSON && window.JSON.parse('{"x":9}', function (k, v) { return "Y"; }) === "Y";
    var jsonDateConverter = function (key, value)
    {
        if (typeof (value) === "string")
        {
            if (dateISO.test(value))
            {
                return new Date(value);
            }
            if (dateNet.test(value))
            {
                return new Date(parseInt(dateNet.exec(value)[1], 10));
            }
        }
        return value;
    };
    $.extend({
        parseJSON: function (data, convertDates)
        {
            /// <summary>Takes a well-formed JSON string and returns the resulting JavaScript object.</summary>
            /// <param name="data" type="String">The JSON string to parse.</param>
            /// <param name="convertDates" optional="true" type="Boolean">Set to true when you want ISO/Asp.net dates to be auto-converted to dates.</param>
            if (typeof data !== "string" || !data)
            {
                return null;
            }
            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = $.trim(data);
            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data
                .replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, "")))
            {
                // Try to use the native JSON parser
                if (extendedJSON || (nativeJSON && convertDates !== true))
                {
                    return window.JSON.parse(data, convertDates === true ? jsonDateConverter : undefined);
                }
                else
                {
                    data = convertDates === true ?
                        data.replace(replaceISO, "new Date(parseInt('$1',10),parseInt('$2',10)-1,parseInt('$3',10),parseInt('$4',10),parseInt('$5',10),parseInt('$6',10),(function(s){return parseInt(s,10)||0;})('$7'))")
                            .replace(replaceNet, "new Date($1)") :
                        data;
                    return (new Function("return " + data))();
                }
            } else
            {
                $.error("Invalid JSON: " + data);
            }
        }
    });
})(jQuery);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Extra datatables code to support server pipelining (get extra data from the server to reduce the number of calls
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var oCache = {
    iCacheLower: -1
};

function fnSetKey(aoData, sKey, mValue)
{
    for (var i = 0, iLen = aoData.length; i < iLen; i++)
    {
        if (aoData[i].name == sKey)
        {
            aoData[i].value = mValue;
        }
    }
}

function fnGetKey(aoData, sKey)
{
    for (var i = 0, iLen = aoData.length; i < iLen; i++)
    {
        if (aoData[i].name == sKey)
        {
            return aoData[i].value;
        }
    }
    return null;
}

function fnDataTablesPipeline(sSource, aoData, fnCallback)
{
    var iPipe = 5; /* Ajust the pipe size */

    var bNeedServer = false;
    var sEcho = fnGetKey(aoData, "sEcho");
    var iRequestStart = fnGetKey(aoData, "iDisplayStart");
    var iRequestLength = fnGetKey(aoData, "iDisplayLength");
    var iRequestEnd = iRequestStart + iRequestLength;
    oCache.iDisplayStart = iRequestStart;

    /* outside pipeline? */
    if (oCache.iCacheLower < 0 || iRequestStart < oCache.iCacheLower || iRequestEnd > oCache.iCacheUpper)
    {
        bNeedServer = true;
    }

    /* sorting etc changed? */
    if (oCache.lastRequest && !bNeedServer)
    {
        for (var i = 0, iLen = aoData.length; i < iLen; i++)
        {
            if (aoData[i].name != "iDisplayStart" && aoData[i].name != "iDisplayLength" && aoData[i].name != "sEcho")
            {
                if (aoData[i].value != oCache.lastRequest[i].value)
                {
                    bNeedServer = true;
                    break;
                }
            }
        }
    }

    /* Store the request for checking next time around */
    oCache.lastRequest = aoData.slice();

    if (bNeedServer)
    {
        if (iRequestStart < oCache.iCacheLower)
        {
            iRequestStart = iRequestStart - (iRequestLength * (iPipe - 1));
            if (iRequestStart < 0)
            {
                iRequestStart = 0;
            }
        }

        oCache.iCacheLower = iRequestStart;
        oCache.iCacheUpper = iRequestStart + (iRequestLength * iPipe);
        oCache.iDisplayLength = fnGetKey(aoData, "iDisplayLength");
        fnSetKey(aoData, "iDisplayStart", iRequestStart);
        fnSetKey(aoData, "iDisplayLength", iRequestLength * iPipe);

        $.getJSON(sSource, aoData, function (json)
        {
            /* Callback processing */
            oCache.lastJson = jQuery.extend(true, {}, json);

            if (oCache.iCacheLower != oCache.iDisplayStart)
            {
                json.aaData.splice(0, oCache.iDisplayStart - oCache.iCacheLower);
            }
            json.aaData.splice(oCache.iDisplayLength, json.aaData.length);

            fnCallback(json)
        });
    }
    else
    {
        json = jQuery.extend(true, {}, oCache.lastJson);
        json.sEcho = sEcho; /* Update the echo for each response */
        json.aaData.splice(0, iRequestStart - oCache.iCacheLower);
        json.aaData.splice(iRequestLength, json.aaData.length);
        fnCallback(json);
        return;
    }
}


function Trace(x)
{
    if ("undefined" != typeof (System))
        System.Debug.outputString(x);
}



/**  
* Formats the number according to the ‘format’ string;  
* adherses to the american number standard where a comma  
* is inserted after every 3 digits.  
*  note: there should be only 1 contiguous number in the format,  
* where a number consists of digits, period, and commas  
*        any other characters can be wrapped around this number, including ‘$’, ‘%’, or text  
*        examples (123456.789):  
*          ‘0′ - (123456) show only digits, no precision  
*          ‘0.00′ - (123456.78) show only digits, 2 precision  
*          ‘0.0000′ - (123456.7890) show only digits, 4 precision  
*          ‘0,000′ - (123,456) show comma and digits, no precision  
*          ‘0,000.00′ - (123,456.78) show comma and digits, 2 precision  
*          ‘0,0.00′ - (123,456.78) shortcut method, show comma and digits, 2 precision  
*  
* @method format  
* @param format {string} the way you would like to format this text  
* @return {string} the formatted number  
* @public  
*/

// This function removes non-numeric characters
String.prototype.stripNonNumeric = function ()
{
    var str = this + '';
    var rgx = /^\d|\.|-$/;
    var out = '';
    for (var i = 0; i < str.length; i++)
    {
        if (rgx.test(str.charAt(i)))
        {
            if (!((str.charAt(i) == '.' && out.indexOf('.') != -1) ||
            (str.charAt(i) == '-' && out.length != 0)))
            {
                out += str.charAt(i);
            }
        }
    }
    return out;
};

Number.prototype.format = function (format)
{
    if (!typeof format == "string") { return ""; } // sanity check   

    var hasComma = -1 < format.indexOf(','),
        psplit = format.stripNonNumeric().split('.'),
        that = this;

    // compute precision  
    if (1 < psplit.length)
    {
        // fix number precision  
        that = that.toFixed(psplit[1].length);
    }
    // error: too many periods  
    else if (2 < psplit.length)
    {
        throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
    }
    // remove precision  
    else
    {
        that = that.toFixed(0);
    }

    // get the string now that precision is correct  
    var fnum = that.toString();

    // format has comma, then compute commas  
    if (hasComma)
    {
        // remove precision for computation  
        psplit = fnum.split('.');

        var cnum = psplit[0],
        parr = [],
        j = cnum.length,
        m = Math.floor(j / 3),
        n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop   

        // break the number into chunks of 3 digits; first chunk may be less than 3  
        for (var i = 0; i < j; i += n)
        {
            if (i != 0) { n = 3; }
            parr[parr.length] = cnum.substr(i, n);
            m -= 1;
        }

        // put chunks back together, separated by comma  
        fnum = parr.join(',');

        // add the precision back in  
        if (psplit[1]) { fnum += '.' + psplit[1]; }
    }

    // replace the number portion of the format with fnum  
    return format.replace(/[\d,?\.?]+/, fnum);
};

// number formatting function
// copyright Stephen Chapman 24th March 2006, 10th February 2007
// permission to use this function is granted provided
// that this copyright notice is retained intact
// ---- Use this function when you want to exactly specify the format of the number (currency) without using browser locale settings
// We can easily select different formatting by changing the values in the second through eighth parameters. 
// The second parameter is the number of decimal places that the number should have. 
// If the number contains more decimal places than required it will be rounded to the nearest number with that number of decimal places.
// If it has fewer decimal places than specified zeroes will be added to the end. 
// The third parameter is the thousands separator. 
// In our example we used a space but a comma or period may be what is required for your location. 
// The fourth parameter is the decimal point. Either a period or comma is normal here. 
// The fifth and sixth parameters are used for monetary values and one or other of them will contain the currency symbol when required. 
// If your location uses a currency symbol hard against the left of numbers then place that symbol by itself in the fifth parameter eg. '$'.
// If you normally have a space after the currency symbol then add it after the symbol in this '$ '. 
// If your currency symbol comes after the amount instead of before then place it in the sixth parameter instead of the fifth parameter. 
// The seventh and eighth parameters define the symbols to place around the number when the value is negative. 
// The usual values for these parameters would be '-','' but you may have a situation where you want to use '(',')' or even '',' CR'. 

function formatNumber(num, dec, thou, pnt, curr1, curr2, n1, n2)
{
    var x = Math.round(num * Math.pow(10, dec));
    if (x >= 0) n1 = n2 = '';

    var y = ('' + Math.abs(x)).split('');
    var z = y.length - dec;

    if (z < 0) z--;

    for (var i = z; i < 0; i++)
        y.unshift('0');

    y.splice(z, 0, pnt);
    if (y[0] == pnt) y.unshift('0');

    while (z > 3)
    {
        z -= 3;
        y.splice(z, 0, thou);
    }

    var r = curr1 + n1 + y.join('') + n2 + curr2;
    return r;
}


//escape an HTML string
function hesc(p_str)
{
    return p_str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}

/*!
* jQuery Cookie Plugin v1.3.1
* https://github.com/carhartl/jquery-cookie
* $.cookie('the_cookie', 'the_value');
* $.cookie('the_cookie', 'the_value', { expires: 7 }); //Create expiring cookie, 7 days from then
* $.cookie('the_cookie', 'the_value', { expires: 7, path: '/' }); //Create expiring cookie, valid across entire site:
*
* $.cookie('the_cookie'); // => "the_value"  // read cookie
* $.cookie(); // => { "the_cookie": "the_value", "...remaining": "cookies" } // read all cookies
* $.removeCookie('the_cookie'); //// Returns true when cookie was found, false when no cookie was found...
* Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie, unless you're relying on the default options that is.
* 
* $.cookie.raw = true;  // don't encode components
* $.cookie.json = true;  // Turn on automatic storage of JSON objects passed as the cookie value. Assumes JSON.stringify and JSON.parse
* see also $.cookie.defaults 
* Copyright 2013 Klaus Hartl
* Released under the MIT license
*/

(function (factory)
{
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else
    {
        // Browser globals.
        factory(jQuery);
    }
} (function ($)
{

    var pluses = /\+/g;

    function raw(s)
    {
        return s;
    }

    function decoded(s)
    {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s)
    {
        if (s.indexOf('"') === 0)
        {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try
        {
            return config.json ? JSON.parse(s) : s;
        } catch (er) { }
    }

    var config = $.cookie = function (key, value, options)
    {

        // write
        if (value !== undefined)
        {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number')
            {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++)
        {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name)
            {
                result = converted(cookie);
                break;
            }

            if (!key)
            {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options)
    {
        if ($.cookie(key) !== undefined)
        {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));


var g_dbConnection;

/////////////////////////////////////////////////////////////////////////////////////
// Opens an ODBC database connection using the pre-defined connection string
// (L_CONNECTION_STRING) if it is defined.  Otherwise it does nothing.
/////////////////////////////////////////////////////////////////////////////////////
function OpenDatabase()
{
    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        try
        {
            g_dbConnection = new ActiveXObject("ADODB.Connection");
            //adodbConnection.CommandTimeout = 60 // Increase: helps with queries to remote databases
            g_dbConnection.Open(L_CONNECTION_STRING);
            return (1 === g_dbConnection.State);
        }
        catch (e)
        {
            return false;
        }
    }
    else
    {
        // don't need to do anything, just report success
        return true;
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// Runs the sql query, and returns an object.
// The return value is an object containing all the returned data rows, or an empty array if no values are found
// If an error occurs the error field is present and contains information about the error
// Example: {"d":[{"BASE_ID":"W-12345","STATUS":"C","DESIRED_QTY":20.0000,"RECEIVED_QTY":20.0000}],
//           "error:{number: 0, description: ""}}"
/////////////////////////////////////////////////////////////////////////////////////
function QueryDatabase(id, sql)
{
    var data = [];
    var response = {};

    try
    {
        var rs = new ActiveXObject("ADODB.Recordset")
        rs.open(sql, g_dbConnection);
        if (!rs.bof)
        {
            rs.MoveFirst();
            while (!rs.eof)
            {
                var row = {};
                for (var i = 0; i != rs.fields.count; ++i)
                    row[rs.fields(i).name] = rs.fields(i).value;
                data.push(row);
                rs.MoveNext()
            }
        }
        rs.close()
        rs = null;

        response[id] = data;
        return response;
    }
    catch (e)
    {
        return { "error": { number: e.number, description: e.message} };
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Closes the connection that OpenDatabase() opened.
/////////////////////////////////////////////////////////////////////////////////////
function CloseDatabase()
{
    if ("undefined" != typeof (L_CONNECTION_STRING))
    {
        if ("ADODB.Connection" == typeof (g_dbConnection))
        {
            if (g_dbConnection.State == adOpenState)
                g_dbConnection.Close();

            g_dbConnection = null;
        }
    }
    else
    {
        // don't need to do anything, just report success
        return true;
    }
}
