
// Contains common functions for all the gadget flyouts



/////////////////////////////////////////////////////////////////////////////////////
// Sets the clipboard text to the string parameter.  Only works in IE
/////////////////////////////////////////////////////////////////////////////////////
function copyToClipboard(s)
{
    if (window.clipboardData && clipboardData.setData)
    {
        clipboardData.setData('text', s);
    }
}



/////////////////////////////////////////////////////////////////////////////////////
// Create an Outlook email message and fill the body with the string parameter
// This is only going to work if Outlook is properly 
// installed on the user's computer
/////////////////////////////////////////////////////////////////////////////////////
function SendEmail( subject, body )
{
    try
    {
        var outlookApp = new ActiveXObject("Outlook.Application");
        var nameSpace = outlookApp.getNameSpace("MAPI");
        mailFolder = nameSpace.getDefaultFolder(6);
        mailItem = mailFolder.Items.add('IPM.Note.FormA');
        mailItem.Subject = subject;
        mailItem.To = "";
        mailItem.HTMLBody = body;
        mailItem.display(0);
    }
    catch (e)
    {
        alert(e);
        // act on any error that you get
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Create an Excel doc and fill the body with the string parameter
// This is only going to work if Excel is properly 
// installed on the user's computer
/////////////////////////////////////////////////////////////////////////////////////
function OpenSpreadsheet( data )
{
    try
    {
        var objExcel = new ActiveXObject("Excel.Application");
        objExcel.visible = true;

        var objWorkbook = objExcel.Workbooks.Add;
        var objWorksheet = objWorkbook.Worksheets(1);
        copyToClipboard(data);
        objWorksheet.Paste;
 
    }
    catch (e)
    {
        alert(e);
        // act on any error that you get
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Create an Outlook email message and fill the body with the flyout contents.  This is only going to work if Outlook is properly 
// installed on the user's computer
/////////////////////////////////////////////////////////////////////////////////////
function OutlookEmail()
{
    try
    {
        var outlookApp = new ActiveXObject("Outlook.Application");
        var nameSpace = outlookApp.getNameSpace("MAPI");
        mailFolder = nameSpace.getDefaultFolder(6);
        mailItem = mailFolder.Items.add('IPM.Note.FormA');
        mailItem.Subject = inspector.shortTitle;
        mailItem.To = "";
        mailItem.HTMLBody = $('#divOutput').html();  //document.body.innerHTML;
        mailItem.display(0);
    }
    catch (e)
    {
        alert(e);
        // act on any error that you get
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simple JQUERY UI combox control
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function ($)
{
    $.widget("ui.combobox",
{
    _create: function ()
    {
        var input,
self = this,
select = this.element.hide(),
selected = select.children(":selected"),
value = selected.val() ? selected.text() : "",
wrapper = $("<span>")
.addClass("ui-combobox")
.insertAfter(select);

        input = $("<input>")
.appendTo(wrapper)
.val(value)
//.addClass("ui-state-default")
.autocomplete({
    delay: 0,
    minLength: 0,
    source: function (request, response)
    {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
        response(select.children("option").map(function ()
        {
            var text = $(this).text();
            if (this.value && (!request.term || matcher.test(text)))
                return {
                    label: text.replace(
new RegExp(
"(?![^&;]+;)(?!<[^<>]*)(" +
$.ui.autocomplete.escapeRegex(request.term) +
")(?![^<>]*>)(?![^&;]+;)", "gi"
), "<strong>$1</strong>"),
                    value: text,
                    option: this
                };
        }));
    },
    select: function (event, ui)
    {
        ui.item.option.selected = true;
        self._trigger("selected", event, {
            item: ui.item.option
        });
    },
    change: function (event, ui)
    {
        if (!ui.item)
        {
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
valid = false;
            select.children("option").each(function ()
            {
                if ($(this).text().match(matcher))
                {
                    this.selected = valid = true;
                    return false;
                }
            });
            if (!valid)
            {
                // remove invalid value, as it didn't match anything
                $(this).val("");
                select.val("");
                input.data("autocomplete").term = "";
                return false;
            }
        }
    }
})
//.addClass("ui-widget ui-widget-content ui-corner-left")
;

        input.data("autocomplete")._renderItem = function (ul, item)
        {
            return $("<li></li>")
.data("item.autocomplete", item)
.append("<a>" + item.label + "</a>")
.appendTo(ul);
        };

        $("<a>")
.attr("tabIndex", -1)
        //.attr("title", "Show All Items")
.appendTo(wrapper)
.button({
    icons: {
        primary: "ui-icon-triangle-1-s"
    },
    text: false
})
.removeClass("ui-corner-all")
.addClass("ui-corner-right ui-button-icon")
.click(function ()
{
    // close if already visible
    if (input.autocomplete("widget").is(":visible"))
    {
        input.autocomplete("close");
        return;
    }

    // work around a bug (likely same cause as #5265)
    $(this).blur();

    // pass empty string as value to search for, displaying all results
    input.autocomplete("search", "");
    input.focus();
});
    },

    destroy: function ()
    {
        this.wrapper.remove();
        this.element.show();
        $.Widget.prototype.destroy.call(this);
    }
});
})(jQuery);


