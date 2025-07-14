# drop_ex_js
Drag and drop an excel file containing data for meta-analysis in the web page, choose a sheet name, click Do Meta-analysis button, then you will have forest plots, a funnel plot, and statistical data from a sheet you choose. The data are processed with JavaScript codes.
### Excel file
Prepare data for meta-analysis with Excel. Two formats are acceptable, one with label column and the other in Minds format.  Download and example Excel file and change the data with your own.
### Web page
A web page "Excel sheets to Meta-analysis with Prediction Interval: Web tool by JavaScript: https://stat.zanet.biz/sr/drop_ex_js.htm  The program uses JavaScript but no other statistical software.  JavaScript libraries xlsx, Math, and jStat are used.
### How to use
1. Drag and drop your Excel file to the panel on the right marked "Drag and Drop your Excel.xlsx fle here".  
2. The list of names of sheets of the Excel file appears in the drop-down menu.  
3. Select the sheet name of the data you want to do meta-analysis.  
4. Click Do Meta-analysis button.  
5. A forest plot with prediction interval and a forest plot without prediction interval, and a funnel plot are created. The result numerical data appear in the text area.  
6. At this moment, effect estimates and 95% conidence intervals, the summary estimate and 95% confidence interval, and prediction interval data are stored in the clipboard. Then you can paste them in Excel sheet.  
7. The result numerical data in the text area can be copied in clipboard by clicking Copy to Clipboard button.  
You can choose another sheet name and do meta-analysis one by one.
# JavaScript codes
### drop_ex_js.js file
Codes for drag-and-drop operation, reading an Excel file, identifying the data range, study ID, comparator, intervention, outcome, the type of effect measure, and making JASON text separated by tab and return. The formatted texts are put in the text area, and in the clipboard too.
### meta_an2_js.js file
meta_an2 function: From the formatted data, doing meta-analysis. Calculating RR, OR, RD, HR, MD, and MSD and their variances for individual studies, calculating summary estimate and variances, calculating variance of the summary estimate (tau2) by REML method, %weight, 95% confidence intervals, creating a forest plot and a funnel plot on the canvas object.
### meta_an2_pi.js file
meta_an_pi2 function: doing the same operations as meta_an2, but adding prediction interval, numerical data are put in the text area, not creating a funnel plot.
