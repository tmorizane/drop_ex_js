document.addEventListener('DOMContentLoaded', function() {
            const dropArea = document.getElementById('drop-area');
            const sheetSelect = document.getElementById('sheet-select');
            const processButton = document.getElementById('process-button');
            let workbook;

            dropArea.addEventListener('dragover', function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.style.borderColor = 'green';
            });

            dropArea.addEventListener('dragleave', function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.style.borderColor = '#ccc';
            });

            dropArea.addEventListener('drop', function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.style.borderColor = '#ccc';

                const files = event.dataTransfer.files;
                if (files.length === 0) {
                    return;
                }
                const file = files[0];
                const reader = new FileReader();

                reader.onload = function(event) {
                    const data = new Uint8Array(event.target.result);
                    workbook = XLSX.read(data, { type: 'array' });
                    
                    // シート名の一覧をドロップダウンメニューに追加
                    sheetSelect.innerHTML = '';
                    workbook.SheetNames.forEach(sheetName => {
                        const option = document.createElement('option');
                        option.value = sheetName;
                        option.textContent = sheetName;
                        sheetSelect.appendChild(option);
                    });
                };
                
                reader.readAsArrayBuffer(file);
            });

            processButton.addEventListener('click', function() {
                const selectedSheetName = sheetSelect.value;
                if (!workbook || !selectedSheetName) {
                    alert('Excelファイルをドロップし、シートを選択してください。');
                    return;
                }
				const worksheet = workbook.Sheets[selectedSheetName];
const izormi = worksheet['A3'] ? worksheet['A3'].v : '';
  if(izormi != "診療ガイドライン"){
 
// "author" or "study"を含むセルを検索
const searchStrings = ["author", "study"];
const findCell = (worksheet, searchStrings) => {
  for (const cellAddress in worksheet) {
    if (cellAddress[0] === '!') continue;
    const cell = worksheet[cellAddress];
    if (searchStrings.includes(cell.v)) {
      return cellAddress;
    }
  }
  return null;
};

const cellAddress = findCell(worksheet, searchStrings);
if (cellAddress) {
  const col = cellAddress.match(/[A-Z]+/)[0];
  const row = cellAddress.match(/[0-9]+/)[0];
  console.log(`"${worksheet[cellAddress].v}" found at row: ${row}, column: ${col}`);
} else {
  console.log('Neither "author" nor "study" was found');
}
	//
const getRowIndexColIndex = (cellAddress) => {
  const col = cellAddress.match(/[A-Z]+/)[0];
  const row = cellAddress.match(/[0-9]+/)[0];
  
  const colIndex = col.split('').reduce((sum, char, i) => {
    return sum + (char.charCodeAt(0) - 65 + 1) * Math.pow(26, col.length - i - 1);
  }, -1);

  const rowIndex = parseInt(row, 10) - 1;

  return [rowIndex, colIndex ];
};
var rowcol = getRowIndexColIndex(cellAddress);
var begrow = rowcol[0];
var begcol = rowcol[1];

const getCellAddress = (row, col) => {
  const colLetter = String.fromCharCode(65 + col); // 65はASCIIコードの'A'に対応
  return `${colLetter}${row + 1}`; // 行番号は1から始まるため+1します
};

var i; 
var j;
for(j=0;j<10;j++){
var cellAd = getCellAddress(begrow,j);
var celval = worksheet[cellAd];
var cellValue = celval ? celval.v : undefined;
if(cellValue == "label"){
var endcol = j;
break;
}
}
//
for(i=begrow;i<100;i++){
cellAd = getCellAddress(i,begcol);
celval = worksheet[cellAd];
cellValue = celval ? celval.v : undefined;
if(cellValue == undefined){
var endrow = i - 1;
break;
}
}
if(endrow < begrow + 10){
endrow = begrow + 10;
}
var begcell = getCellAddress(begrow,begcol);
var endcell = getCellAddress(endrow,endcol);
var rng = begcell+":"+endcell;
                    // データをJSON形式で取得
                    const jdat = XLSX.utils.sheet_to_json(worksheet, { header: 1, range:rng});
                    console.log(jdat);
					var endrw = endrow - begrow;					
					var endcl = endcol - begcol;
					var exdat = "";
					var celval = "";
					for ( i = 0;i<endrw+1;i++){
					for (j = 0;j<endcl+1;j++){
					if(jdat[i][j] == "" || jdat[i][j] === undefined){
					celval = "";
					}else{
					celval = jdat[i][j];
					}
					if(jdat[i][j] == "0"){
					celval="0";
					}
					//
					if(i == 7 && j == endcl && (jdat[i][j] == "" || jdat[i][j] === undefined)){
					celval="";
					}
					if(i == 8 && j == endcl && (jdat[i][j] == "" || jdat[i][j] === undefined)){
					celval="REML";
					}
					if(i == 9 && j == endcl && (jdat[i][j] == "" || jdat[i][j] === undefined)){
					celval="";
					}
					if(i == 10 && j == endcl && (jdat[i][j] == "" || jdat[i][j] === undefined)){
					celval="Event";
					}
					//
					exdat = exdat + celval;
					if(j < endcl ){
					exdat = exdat + "\t";
					}
					if(j == endcl){
					exdat = exdat + "\n";
					}
					}
					}
					meta_an2(exdat);
					meta_an_pi2(exdat);
}		
if(izormi == "診療ガイドライン"){
	///Function: Get cellAddress A1, B3, etc from row and col number
const getCellAddress = (row, col) => {
  const colLetter = String.fromCharCode(65 + col); // 65はASCIIコードの'A'に対応
  return `${colLetter}${row + 1}`; // 行番号は1から始まるため+1します
};
///
var label = [];
label[0] = "label";
label[1] = "Author Year";
var pos;
var cellAd = getCellAddress(4,0);
var celval = worksheet[cellAd];
var taisho = celval ? celval.v : undefined;
if(taisho == "対象"){
	pos = 1;
}else{
	pos = 0;
}

//Comparator
var cellAd = getCellAddress(pos + 5,2);
var celval = worksheet[cellAd];
 label[2] = celval ? celval.v : undefined;
//Intervention
 cellAd = getCellAddress(pos + 4,2);
 celval = worksheet[cellAd];
 label[3] = celval ? celval.v : undefined;
//Outcome
 cellAd = getCellAddress(7,2);
 celval = worksheet[cellAd];
 label[4] = celval ? celval.v : undefined;
//

label[7] = "Random-effects model";
label[8] = "REML";
label[9] = "Event or reverse";
label[10]= "Event";
//Effect measure type
var sdes;
var rob;
var emtype;
var endcol;
var begcol;
//For RoB2
 cellAd = getCellAddress(11,19);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
 if(emtype == "RR" || emtype == "OR" || emtype == "RD" || emtype == "MD" || emtype == "SMD"){
	 endcol = 19;
	 rob = 2;
	 begcol = 13;
 }
 cellAd = getCellAddress(11,17);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
  if(emtype == "HR"){
	 endcol = 17;
	 rob = 2;
	 begcol = 13;
 }
 //For Minds 8 RoBs
 cellAd = getCellAddress(11,23);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
 if(emtype == "RR" || emtype == "OR" || emtype == "RD" || emtype == "MD" || emtype == "SMD"){
	 endcol = 23;
	 rob = 1;
	 begcol = 17;
 }
 cellAd = getCellAddress(11,21);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
  if(emtype == "HR"){
	 endcol = 21;
	 rob = 1;
	 begcol = 17;
 }
 //For observational studies
 cellAd = getCellAddress(11,24);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
 if(emtype == "RR" || emtype == "OR" || emtype == "RD" || emtype == "MD" || emtype == "SMD"){
	 endcol = 24;
	 rob = 1;
	 begcol = 18;
 }
 cellAd = getCellAddress(11,22);
 celval = worksheet[cellAd];
 emtype = celval ? celval.v : undefined;
  if(emtype == "HR"){
	 endcol = 22;
	 rob = 1;
	 begcol = 18;
 }
 
 cellAd = getCellAddress(11,endcol);
 celval = worksheet[cellAd];
 var emtype = celval ? celval.v : undefined;

 label[6] = emtype;

 if(emtype == "RR"){ label[5] = "Risk Ratio";}
 if(emtype == "OR"){ label[5] = "Odds Ratio";}
 if(emtype == "RD"){ label[5] = "Risk Differece";}
 if(emtype == "HR"){ label[5] = "Hazard Ratio";}
 if(emtype == "MD"){ label[5] = "Mean Difference";}
 if(emtype == "SMD"){ label[5] = "Std Mean Difference";}

var endlabe = 11;

var i;  
var begrow = 11;
for(i =begrow;i<begrow+50;i++){	//find the last row with data
 cellAd = getCellAddress(i,0);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 if(cellvalue == "" || cellvalue == undefined){
	 var endrow = i;
	 break;
 }
}

var exdat = "author"+"\t";
if(emtype == "RR" || emtype == "OR" || emtype == "RD"){
exdat = exdat + "nc" + "\t";
exdat = exdat + "rc" + "\t";
exdat = exdat + "nt" + "\t";
exdat = exdat + "rt" + "\t";
exdat = exdat + label[0] + "\n";
}

if(emtype == "HR"){
	exdat = exdat + "nt" + "\t";
	exdat = exdat + "nc" + "\t";
	exdat = exdat + "yi" + "\t";
	exdat = exdat + "sei" + "\t";
	exdat = exdat + label[0] + "\n";
}
if(emtype == "MD" || emtype == "SMD"){
	exdat = exdat + "n2i" + "\t";
	exdat = exdat + "m2i"+ "\t";
	exdat = exdat + "sd2i" + "\t";
	exdat = exdat + "n1i" + "\t";
	exdat = exdat + "m1i"+ "\t";
	exdat = exdat + "sd1i" + "\t";
	exdat = exdat + label[0] + "\n";
}

var j;
if(emtype == "RR" || emtype == "OR" || emtype == "RD"){
var beglabe = 1;
for(i = begrow;i<endrow;i++){
 cellAd = getCellAddress(i,0);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol+1);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
  cellAd = getCellAddress(i,begcol+3);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
   cellAd = getCellAddress(i,begcol+4);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 exdat = exdat + label[beglabe] + "\n";
 beglabe++;
}
}
//
if(emtype == "HR"){
var beglabe = 1;
for(i = begrow;i<endrow;i++){
 cellAd = getCellAddress(i,0);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol+1);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
  cellAd = getCellAddress(i,begcol+2);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
   cellAd = getCellAddress(i,begcol+3);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 exdat = exdat + label[beglabe] + "\n";
 beglabe++;
}
}
//
if(emtype == "MD" || emtype == "SMD"){
var beglabe = 1;
for(i = begrow;i<endrow;i++){
 cellAd = getCellAddress(i,0);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 cellAd = getCellAddress(i,begcol+1);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
  cellAd = getCellAddress(i,begcol+2);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
   cellAd = getCellAddress(i,begcol+3);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
    cellAd = getCellAddress(i,begcol+4);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
     cellAd = getCellAddress(i,begcol+5);
 celval = worksheet[cellAd];
 cellvalue = celval ? celval.v : undefined;
 exdat = exdat + cellvalue + "\t";
 exdat = exdat + label[beglabe] + "\n";
 beglabe++;
}
}
var numsu = 5;
if(emtype == "MD" || emtype == "SMD"){
	numsu = 7;
}

if(beglabe < endlabe){
	for(i = beglabe;i<endlabe;i++){
		for(j=0;j<numsu;j++){
		exdat = exdat + "" + "\t";
		}
		exdat = exdat + label[beglabe] + "\n";
		beglabe++;
	}
}
//					
			//alert(exdat);
			meta_an2(exdat);
			meta_an_pi2(exdat);


}
			
});

});			