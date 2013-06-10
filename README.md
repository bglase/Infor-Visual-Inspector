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
The gadget has been used with Windows Vista, 7, and 8, together with SQL Server 2008 and Visual 6.5.4, 7.0, and 7.1.  It probably works with other database engines as well, if you specify the correct connection strings and SQL syntax.

Initial Setup
=============
Download the code package, and extract to your Windows sidebar folder (doing this allows you to modify the gadget and then 
test the result immediately.  Windows stores your gadgets in a hidden user-specific folder.  To find the right place, click the start button, and in the 'Search Programs and Files' box, type 
%appdata%\Local\Microsoft\Windows Sidebar\Gadgets
Your file explorer should open, showing an empty folder, or a set of folders corresponding to sidebar gadgets you are already using.
Put the dev.Visual.Gadget folder there.  Below, this folder is called the 'dev' folder and unless otherwise noted, any file names/paths are inside this folder.

What you should probably do at this point is try the gadget, without modifying anything, to make sure things are going well so far.  Since you installed the source in your windows gadget folder, you should be able to immediately test it.  Right click on you desktop, choose 'Gadgets' and you should see the Inspector in the list of choices.  If 'Gadgets' is not a selection on your desktop, the use of Sidebar Gadgets may be disabled on your PC.  This can be the case, for example, if your IT department disables Gadgets by default.  If you can open the Gadgets menu, but the 'V'isual gadget is not there, maybe you put the folder in the wrong place?

If you double-click the 'V' icon, it will open the gadget, which at this point looks like a plain black box.  Not to worry, hover your mouse over the black box, and you should see a small wrench icon appear.  That is what allows you to choose what is displayed in the inspector.  Click it, and you will see a dialog of the available inspectors.  Since you haven't yet designed your own, you'll just see the examples I included.  'Add' one or more to the 'Included' list and click OK. 

Things the 'developer' may want to customize:
1) The logo/graphics: you can change the files in the images\ folder; notably the banner-logo.png, and gadget_top_large.png.  If you make significant changes, like to the size of these images, you may have to edit the HTML or CSS files that use the images in order to get the intended look.  Someone familiar with web page development will probably be able to update the 'look' without too many problems.

2) Edit the gadget.xml to customize the name of your company, the icon that is shown in the Gadget selector, etc.  This file follows the conventions of Windows Sidebar manifests, so refer to Microsoft's documentation with any questions.

3) In Local.js, you can customize the URL of your company's home page, and VERY IMPORTANT: include the ODBC connection string needed to access your database.  The contents of this string depend on a number of things specific to your organization and database deployment; if you need help you might try googling 'odbc connection strings'

4) make.bat conveniently packages up the gadget for installation by your users.  If you want to digitally sign the gadget before publishing it, you can modify make.bat with your organization's signing certificate, and/or customize the location(s) where gadget files are stored.







Use
===
