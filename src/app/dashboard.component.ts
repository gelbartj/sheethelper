import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';

import { ExcelTable } from './excel';

import { saveAs } from '../FileSaver.min.js';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {	

  constructor(private renderer: Renderer) {}
	
  showResult = false;
  showSelector = false;

  sheet1: ExcelTable = new ExcelTable();
  sheet2: ExcelTable = new ExcelTable();
  result: ExcelTable = new ExcelTable();
  
  showSheet1Entry = true;
  showSheet1Table = false;
  showSheet2Entry = true;
  showSheet2Table = false;
  
  showDouble = true;
  
  matchType = 2;
  resultType = 1;
  
  removeMatchedColumns = true;
  
  downloadFile(filename: string, rows: any[]) {
		var processRow = function (row: any[]) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                }
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = " "; // space instead of "" to prevent excel SYLK error
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }
		
		
		  var mediaType = 'text/csv';
          var blob = new Blob([csvFile], {type: mediaType});
          var filename = filename;
          saveAs(blob, filename);
    }

    changeMatch(matchNum: number) {
	  this.matchType = matchNum;
	  this.showDouble = !(this.showDouble);
	  this.updateResult();
    }
	
	toggleHideColumns() {
	  this.removeMatchedColumns = !(this.removeMatchedColumns);
	  this.updateResult();
    }
	
	changeResultType(resultType: number) {
	  this.resultType = resultType;
	  this.updateResult();
    }
  
    updateResult(sheet?: ExcelTable,calcType: number = this.matchType) {
	  if (sheet) { sheet.updateData(); }
	  if (this.sheet2.rawData && this.sheet1.rawData) {
		this.showSelector = true;
		if (this.resultType == 3) {
			this.result = this.calcMatches(this.sheet2,this.sheet1,calcType);
		}
		else {
			this.result = this.calcMatches(this.sheet1,this.sheet2,calcType);
		}
		this.showResult = true;
	  }	  
    }
  
    toggleHeader(sheet: ExcelTable) {
	  sheet.hasHeader = !(sheet.hasHeader);
	  this.updateResult();
    }
  
    updateCol(sheet: ExcelTable,newCol: number,colId: number) {
	  if (colId == 1) {
		//sheet.selectedCol1 = +(<HTMLSelectElement>event.target).value;
		sheet.selectedCol1 = newCol;
	  }
	  else if (colId == 2) {
		  //sheet.selectedCol2 = +(<HTMLSelectElement>event.target).value;
		  sheet.selectedCol2 = newCol;
	  }
	  this.updateResult();
    }
  
	@ViewChild('data1', {static:false}) data1: ElementRef;
	@ViewChild('data2', {static:false}) data2: ElementRef;
  
    hideMe(sheetNum: number,event?: Event) {
	  /*if (event) { 
		if (!(<HTMLSelectElement>event.target).value) { return; }
	  }*/
	  /*if (event) {
		  this.renderer.invokeElementMethod(event.nativeElement,'select');
		  }*/
		
		  if (sheetNum == 1) {
			  if (this.sheet1.rawData) {
				  this.showSheet1Entry = !(this.showSheet1Entry);
				  this.showSheet1Table = !(this.showSheet1Table);
				  /* //uncomment for auto-select
				  if (this.showSheet1Entry) { 
					console.log('Triggered');
					console.log(this.data1.nativeElement);
					this.renderer.invokeElementMethod(this.data1.nativeElement,'select', []); 
					}
					*/
			  }
		  }
		  if (sheetNum == 2) {
			  if (this.sheet2.rawData) {
			  this.showSheet2Entry = !(this.showSheet2Entry);
			  this.showSheet2Table = !(this.showSheet2Table);
			  //this.renderer.invokeElementMethod(this.data2.nativeElement,'select');
			  }
		  }
	}	  
  
	 nameStrip(inputName: string) {
		 if (inputName) { //check for undefined
		  var stripped = inputName.trim().replace(/['",-.:;_`~“”‘’\s]/g,""); // remove all punctuation and spaces
		  return stripped.toUpperCase();
		 }
	}
  
	combineNames(firstNames: string[], lastNames: string[]): string[] {
	  // Combine first and last names, stripping out punctuation, extra spaces, capitalization, etc.
	  let resultNames: string[] = [];
	  if (firstNames.length == lastNames.length) {
		  for (var i=0; i<firstNames.length; i++) {
			  resultNames.push(this.nameStrip(firstNames[i]) + " " + this.nameStrip(lastNames[i]));
		  }
		  return resultNames;
	  }
	  else {
		  throw new RangeError();
	  }
	}
	
	makeHeader(source: ExcelTable,target: ExcelTable,matchType: number) {
		let resultTable = new ExcelTable();
		let addedTargetHeader: string[] = [];
		let emptyTargetHeader: string[] = [];
		if (target.hasHeader) {
			if (matchType == 1) {
				for (var arrayCounter = 0; arrayCounter < target.formatData[0].length; arrayCounter++) {
					if (this.removeMatchedColumns && arrayCounter == target.selectedCol1) { continue; } // skip matched column
					addedTargetHeader.push(target.formatData[0][arrayCounter]);
				}
			}
			else { 
				for (var arrayCounter = 0; arrayCounter < target.formatData[0].length; arrayCounter++) {
					if (this.removeMatchedColumns && (arrayCounter == target.selectedCol1 || arrayCounter == target.selectedCol2)) { continue; } // skip matched column
					addedTargetHeader.push(target.formatData[0][arrayCounter]);
				} 
			}
		}
		
		if (source.hasHeader || target.hasHeader) { 
			resultTable.hasHeader = true;
			if (source.hasHeader && target.hasHeader) {
				resultTable.formatData.push(source.formatData[0].concat(addedTargetHeader));
			}
			else {
				let columnAdjuster = 0;
				if (matchType == 1 && this.removeMatchedColumns == true) { columnAdjuster = 1; }
				if (matchType == 2 && this.removeMatchedColumns == true) { columnAdjuster = 2; }
				if (matchType == 1) {
					emptyTargetHeader = Array.apply(null, Array(target.formatData[0].length - columnAdjuster)).map(function (x: number,z: number) {var y = z + 1; return "Column " + y;}); // subtract one to account for removal of matched column
				}
				else {
					emptyTargetHeader = Array.apply(null, Array(target.formatData[0].length - columnAdjuster)).map(function (x: number,z: number) {var y = z + 1; return "Column " + y;});
				}
				let emptySourceHeader = Array.apply(null, Array(target.formatData[0].length)).map(function (x: number,z: number) {var w = z + 1; return "Column " + w});
				if (source.hasHeader) { resultTable.formatData.push(source.formatData[0].concat(emptyTargetHeader)); }
				if (target.hasHeader) { resultTable.formatData.push(emptySourceHeader.concat(addedTargetHeader)); }
			}
		}
		else {
			resultTable.hasHeader = false;
		}
		return resultTable;
	}
	
	findDupes(source: ExcelTable, target: ExcelTable, matchType: number=1) {
		// Create array of [source row, matched target row, source duplicate?, target duplicate? ]
		// Start by saving existing order
		// Then sort by selectedCol1
		let idAndCol: Array<string[]> = [];
		let xArray: string[] = [];
		let counter = "0";
		let column = source.getCol(source.selectedCol1);
		let sourceFlag = source.hasHeader;
		for (let x of column) {
			if (sourceFlag) {
				counter = (parseInt(counter) + 1).toString();
				sourceFlag = !sourceFlag;
				continue;
			}
			xArray = [counter];
			idAndCol.push((xArray.concat(x)).concat("0")); 
			counter = (parseInt(counter) + 1).toString();
		}
		idAndCol.sort(function(a: any, b: any) {
			a = a[1];
			b = b[1];
			return a < b ? -1 : (a > b ? 1 : 0);
		});
		for (var y=0; y < idAndCol.length - 1; y++) {
			if (idAndCol[y][1] == idAndCol[y+1][1]) {
				idAndCol[y][2]="DUPE";
				idAndCol[y+1][2]="DUPE";
			}
		}
		return idAndCol;
	}
  
	calcMatches(source: ExcelTable,target: ExcelTable,matchType: number,resultType: number=this.resultType,removeMatchedColumns: boolean = this.removeMatchedColumns) {
	  /* resultType options: 1 for combined table, 2 for all source rows, 3 for all target rows */
	  let resultTable = new ExcelTable();
	  let matchFound = false;
	  let sourceArray: string[] = [];
	  let targetArray: string[] = [];
	  
	  let sourceLength = 0;
	  let targetLength = 0;
	  
	  if (matchType == 2) {
		  if (source.formatData.length > 1 && target.formatData.length > 1) {
			sourceArray = this.combineNames(source.getCol(source.selectedCol1),source.getCol(source.selectedCol2));
			targetArray = this.combineNames(target.getCol(target.selectedCol1),target.getCol(target.selectedCol2));
			sourceLength = sourceArray.length;
			targetLength = targetArray.length;
		  }
	  }
	  
	  else { 
		sourceLength = source.formatData.length;
		targetLength = target.formatData.length; 
	  }
	  
	  for (var i=0;i<sourceLength;i++) { // i is a row counter
		matchFound = false;
		for (var j=0;j<targetLength;j++) { // j is a row counter
			if (i == 0 && j == 0) { //first loop
				// Show header row even if column names don't match
				resultTable = this.makeHeader(source,target,matchType);
				if (source.hasHeader || target.hasHeader) { 
					matchFound = true;
					break; 
				}
			}
			if (matchType == 1) {
				if (source.formatData[i][source.selectedCol1] == target.formatData[j][target.selectedCol1]) {
					matchFound = true;
				}
			}
			if (matchType == 2) {
				if (sourceArray[i] == targetArray[j]) {
					matchFound = true;
				}
			}
			
			if (matchFound) {
				let jPrime: string[] = [];
				for (var arrayCounter = 0; arrayCounter < target.formatData[j].length; arrayCounter++) {
					if (removeMatchedColumns) {
						if (arrayCounter == target.selectedCol1) { 
							continue;
						} // skip matched column
						if (matchType == 2 && arrayCounter == target.selectedCol2) {
							continue;
						}
					}
					jPrime.push(target.formatData[j][arrayCounter]);
				}

				resultTable.formatData.push(source.formatData[i].concat(jPrime));
				break; // prevent duplicates (only allow one source row)
			} 				
		}
		
		if (resultType != 1 && matchFound == false){
			resultTable.formatData.push(source.formatData[i].concat(["NO MATCH"]));	
		}
	  }

	return resultTable; 
    }
}
