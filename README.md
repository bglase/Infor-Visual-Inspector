Infor Visual Inspector
======================

Microsoft Windows(R) Sidebar Gadget with handy stats for Infor's Visual ERP system.

This gadget can be added to a user's desktop.  It displays a variety of (user-selectable) metrics from the ERP system.
For example, an order entry clerk may choose to view the latest incoming orders, overdue orders, and similar information.  
A member of the accounting team might select overdue receivables or payables, while a system administrator might 
choose to see who is logged into the system, or if certain problems exist, etc.

In order to use this gadget effectively, you will need to customize it for your organization.  Someone with basic knowlege of
Javascript and SQL will need to create the specific metrics that your organization needs.  A few example 'inspectors' are
included, but they only scratch the surface of what is possible.  Knowledge of HTML and CSS will be helpful if you want to 
customize the look of the gadget or make extensive customizations.

Compatibility:
The gadget has been used with Windows Vista and 7, together with SQL Server 2008 and Visual 6.5.4, 7.0, and 7.1.  It probably works with other database engines as well, if you specify the correct connection strings and SQL syntax.

Initial Setup
=============
Download the code package, and extract to your Windows sidebar folder (doing this allows you to modify the gadget and then 
test the result immediately.  Windows stores your gadgets in a hidden user-specific folder.  To find the right place, click the start button, and in the 'Search Programs and Files' box, type 
%localappdata%\Local\Microsoft\Windows Sidebar\Gadgets
Your file explorer should open, showing an empty folder, or a set of folders corresponding to sidebar gadgets you are already using.
Put the dev.Visual.Gadget folder there.  In the instructions below, this folder is called the 'dev' folder and unless otherwise noted, any file names/paths referenced are inside this folder.

What you should probably do at this point is try the gadget, without modifying anything, to make sure things are going well so far.  Since you installed the source in your windows gadget folder, you should be able to immediately test it.  Right click on you desktop, choose 'Gadgets' and you should see the Inspector (a 'V' icon) in the list of choices.  If 'Gadgets' is not a selection on your desktop, the use of Sidebar Gadgets may be disabled on your PC.  This can be the case, for example, if your IT department disables Gadgets by default.  If you can open the Gadgets menu, but the 'V'isual gadget is not there, maybe you put the folder in the wrong place?

If you double-click the 'V' icon, it will open the gadget, which at this point looks like a plain black box.  Not to worry, hover your mouse over the black box, and you should see a small wrench icon appear.  That is what allows you to choose what is displayed in the inspector.  Click it, and you will see a dialog of the available inspectors.  Since you haven't yet designed your own, you'll just see the examples I included.  'Add' one or more to the 'Included' list and click OK. 

Oh no! the black box is still black!  That's OK; you need to set up the gadget to work in your environment: notably how to connect to your Visual installation, but you might also want to change the look a bit.  The next section is for 'developers' who customize and publish a version of the gadget for users.

Things the 'developer' may want to customize
============================================
1) The logo/graphics: you can change the files in the images\ folder; notably the banner-logo.png, and gadget_top_large.png.  If you make significant changes, like to the size of these images, you may have to edit the HTML or CSS files that use the images in order to get the intended look.  Someone familiar with web page development will probably be able to update the 'look' without too many problems.

2) Edit the gadget.xml to customize the name of your company, the icon that is shown in the Gadget selector, etc.  This file follows the conventions of Windows Sidebar manifests, so refer to Microsoft's documentation with any questions.

3) make.bat conveniently packages up the gadget for installation by your users.  If you want to digitally sign the gadget before publishing it, you can modify make.bat with your organization's signing certificate, and/or customize the location(s) where gadget files are stored.

4) The bulk of the customization is done in the inspectors.js file.  It contains comments, but here is an overview of what you should look at:
    a) The top has a large commented example of an inspector.  Each inspector is basically a big JavaScript object that contains the definition of the inspector: what it queries and how the information is displayed.
    b) Next there is the connection configuration.  The inspector can work with both a 'direct' ODBC connection using the drivers installed on the user's Windows installation, or get its data from a JSON feed on a web server.  Only the 'direct' method is discussed in detail; while the web server approach has some benefits (like offloading the querying to the server), it also requires configuration of a web server which is not discussed here.
    Change the definition of L_CONNECTION_STRING to the ODBC connection string needed to access your database.  The contents of this string depend on a number of things specific to your organization and database deployment; if you need help you might try googling 'odbc connection strings'
    c) Finally, there is a set of inspector definitions.  Be careful editing this list; if you put in invalid JavaScript, the gadget probably just won't work (like not show any inspectors).  If this happens, check your syntax in inspectors.js, or back up to a working version and try again.  TIP: if you have Microsoft Visual Studio, insert the word 'debugger;' in a javascript function, and it will launch Visual Studio and let you debug the code.
    
To make a new inspector, the best way is to copy one of the examples, add it to the bottom of the file, and change it to your desires.  Refer to the description at the top of inspectors.js for help on what the various things mean.

After you add or modify an inspector, you should close the inspector, and re-open it. This causes your updated javascript to be read and used by the gadget.

Distributing the Gadget
=======================
Run the make.bat file, and in the dev folder you should have a file called visual.gadget, timestamped with the current time.  Put that file where your users can run it, like on a shared network drive.  When they run it, it will install the gadget for them.
Note: you should change the revision of the gadget: in gadget.xml, when you make changes.  This will help make sure everyone keeps the latest version.


