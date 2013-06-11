
// source code for settings dialog


var NothingSelected = -1;

// Called when the page loads
$(document).ready(function ()
{
    if ("undefined" != typeof (System))
    {
        // if this page was launched by the gadget (not in test mode)
        System.Gadget.onSettingsClosing = settingsClosing;
    }

    // stylize the buttons
    $('input:button').button();

    $("#lblAvailable").html(L_AVAILABLE_INSPECTORS);
    $("#lblIncluded").html(L_INCLUDED);
    /*document.getElementById("add").value = L_ADD;
    document.getElementById("remove").value = L_REMOVE;
    document.getElementById("up").value = L_UP;
    document.getElementById("down").value = L_DOWN;
    */
    SettingsManager.loadFile();
    generateTable();

});

/////////////////////////////////////////////////////////////////////////////////////
// Loads up the selection boxes
/////////////////////////////////////////////////////////////////////////////////////
function generateTable()
{
    var i = 0;
    var lstAvailable = document.forms(0).lstAvailable;

    lstAvailable.length = 0;
    
    for (var insp in g_inspectors)
    {
        //Trace(g_inspectors[insp].description);
        lstAvailable[lstAvailable.length] = new Option(g_inspectors[insp].description, g_inspectors[insp].name);
    }


    // Now load the user's previous choices, and move them to the 'included' list. 
    // If System is not defined, it means we are not running in a sidebar gadget
    if ("undefined" != typeof (System))
    {
        for (i = 0; i < MAX_INSPECTORS; i++)
        {
            var ins = SettingsManager.getValue("included", i, "");
            if (ins > "")
            {
                for (var j = 0; j < lstAvailable.options.length; j++)
                {
                    if (lstAvailable.options[j].value == ins)
                    {
                        lstAvailable.options[j].selected = true;
                    }
                }
            }
        }
        addInspector();  // move the selected ones to the Included box
    }
}

/////////////////////////////////////////////////////////////////////////////////////
//Add moves the selected item(s) in the available list and moves them to the included list
/////////////////////////////////////////////////////////////////////////////////////
function addInspector()
{
    moveOptions(document.forms[0].lstAvailable, document.forms[0].lstIncluded, MAX_INSPECTORS);
    manageButtons();
}


/////////////////////////////////////////////////////////////////////////////////////
// Adds an option node to the select box
/////////////////////////////////////////////////////////////////////////////////////
function addOption(theSel, theText, theValue)
{
    var newOpt = new Option(theText, theValue);
    var selLength = theSel.length;
    theSel.options[selLength] = newOpt;
}


/////////////////////////////////////////////////////////////////////////////////////
// Remove option node from the select box
/////////////////////////////////////////////////////////////////////////////////////
function deleteOption(theSel, theIndex)
{
    var selLength = theSel.length;
    if (selLength > 0)
    {
        theSel.options[theIndex] = null;
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// Move all selected options from one select box to another.  Will not let the SelTo box grow past theSelToLimit number of items
/////////////////////////////////////////////////////////////////////////////////////
function moveOptions(theSelFrom, theSelTo, theSelToLimit)
{
    var selLength = theSelFrom.length;
    var selectedText = new Array();
    var selectedValues = new Array();
    var selectedCount = 0;
    var selToLength = theSelTo.length;

    var i;

    // Find the selected Options in reverse order
    // and delete them from the 'from' Select.
    for (i = selLength - 1; i >= 0; i--)
    {
        if (theSelFrom.options[i].selected && (selToLength + selectedCount <= theSelToLimit))
        {
            selectedText[selectedCount] = theSelFrom.options[i].text;
            selectedValues[selectedCount] = theSelFrom.options[i].value;
            deleteOption(theSelFrom, i);
            selectedCount++;
        }
    }

    // Add the selected text/values in reverse order.
    // This will add the Options to the 'to' Select
    // in the same order as they were in the 'from' Select.
    for (i = selectedCount - 1; i >= 0; i--)
    {
        addOption(theSelTo, selectedText[i], selectedValues[i]);
    }
}




/////////////////////////////////////////////////////////////////////////////////////
//Move the selected element up one slot in the list.
/////////////////////////////////////////////////////////////////////////////////////
function moveup()
{
    var optlist = document.forms[0].lstIncluded;
    var i = optlist.selectedIndex;
    if (i == 0 || i == NothingSelected) return; // can't move

    var title = optlist.options[i - 1].text;
    optlist.options[i - 1].text = optlist.options[i].text;
    optlist.options[i].text = title;
    optlist.selectedIndex = i - 1;

    manageButtons();
}

/////////////////////////////////////////////////////////////////////////////////////
//Move the selected element down one slot in the list.
/////////////////////////////////////////////////////////////////////////////////////
function movedown()
{
    var optlist = document.forms[0].lstIncluded;
    var i = optlist.selectedIndex;

    if (i == optlist.options.length - 1 || i == NothingSelected) return; // can't move

    //Changes the display
    var title = optlist.options[i + 1].text;
    optlist.options[i + 1].text = optlist.options[i].text;
    optlist.options[i].text = title;
    optlist.selectedIndex = i + 1;

    manageButtons();
}

//Remove the selected element from the list
//Moves all elements below the removed element up one slot.
function removeInspector()
{
    moveOptions(document.forms[0].lstIncluded, document.forms[0].lstAvailable, 10000);
    manageButtons();
}

/////////////////////////////////////////////////////////////////////////////////////
//Disable and enable buttons as appropriate.
/////////////////////////////////////////////////////////////////////////////////////
function manageButtons()
{
    var form = document.forms[0];
    var optlist = form.lstIncluded;
    var selected = optlist.selectedIndex;
    var last = optlist.options.length - 1;

    // if at least 1 option in the Available list is selected, enable the add button
    var bDisable = true;

    for (var x = 0; x < form.lstAvailable.options.length; x++)
    {
        if (form.lstAvailable.options[x].selected) bDisable = false;
    }
    form.add.disabled = bDisable;

    if (selected == NothingSelected)
    {
        form.up.disabled = true;
        form.down.disabled = true;
        form.remove.disabled = true;
    }
    else
    {
        //Top element selected
        if (selected == 0)
        {
            form.up.disabled = true;
        }
        else
        {
            form.up.disabled = false;
        }

        //Last element selected
        if (selected == last)
        {
            form.down.disabled = true;
        }
        else
        {
            form.down.disabled = false;
        }
        form.remove.disabled = false;
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// Called when window is closed.  If user clicked OK save the settings
/////////////////////////////////////////////////////////////////////////////////////
function settingsClosing(event)
{
    var opt = document.forms[0].lstIncluded.options;
    if (event.closeAction == event.Action.commit)
    {
        SettingsManager.deleteGroup("included");
        for (var i = 0; i < opt.length; i++)
        {
            SettingsManager.setValue("included", i, opt[i].value);
        }
        SettingsManager.saveFile();
    }
    else if (event.closeAction == event.Action.cancel)
    {
    }
}

