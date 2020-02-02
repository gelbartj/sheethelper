export class ExcelTable {
	id: number;
	rawData: string = '';
	formatData: string[][] = []; // array of arrays, by row
	selectedCol1: number=0;
	selectedCol2: number=0;
	hasHeader = true;
	
	getCol(col: number): string[] {
		let colResult: string[] = [];
		if (!this.formatData) {
			this.updateData();
		}
		if (!this.formatData) { 
			return; 
		}
		else {
			for (let row of this.formatData) {
				colResult.push(row[col]); // get the item in "col" column for each row
			}
			return colResult;
		}
		
	}
	
	// Transform raw data into array
	updateData() {
	  let dataArray: string[][] = [];
	  let rows = this.rawData.split('\n');
	  for (let r in rows) {
		//dataObj.hasHeaders = rows[r].split(' ');
		//continue;
		let cols = rows[r].split('\t');
		if (cols.length == 1 && !(cols[0])) {  // prevent blank rows
		continue;
		} 
		else {	dataArray[r] = cols; } 
	  }
	  this.formatData = dataArray;
	  
	  let firstNames: string[] = ["FIRST", "FIRSTNAME"];
	  let lastNames: string[] = ["LAST", "LASTNAME"];
	  
	  if (this.hasHeader) {
		  console.log("At beginning: " + this);
		  this.formatData[0].forEach(function(value, i) {
			  var stripped = value.trim().replace(/['",-.:;_`~“”‘’\s]/g,"").toUpperCase(); // remove all punctuation and spaces
			  if (firstNames.indexOf(stripped) != -1) {
				this.selectedCol1 = i;
			  }
			  if (lastNames.indexOf(stripped) != -1) {
				this.selectedCol2 = i;
			  }
		  },this);  
	  }
	}
}