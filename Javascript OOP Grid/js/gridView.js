Element.prototype.addEvent = function(eventType, eventHandler){
	// If lt IE8 and other legasy - deatach global event
	if (!event) { event = window.event; }

	// Get event by browser feature detection 
	if (document.addEventListener) {				
		this.addEventListener(eventType, eventHandler, false);
	} 
	else if (document.attachEvent) {				
		this.attachEvent(eventType, eventHandler);
	} 
	else {
		document["on" + eventType];
	}
}

var controls = (function(){
	var tableRowsCounter = 0;
	
	GridView = function(params){
		var gridHolder = "",
			table = "",
			tbody = "",
			gridRows = [];

		var id = params.id;
		if (params.holder != undefined) {
			gridHolder = document.querySelector(params.holder);
		};

		table = document.createElement("table");
		tbody = document.createElement("tbody");
		
		function addNewRow(cells){
			var rowCellsText = [];

			for (var i = 0; i < cells.length; i++) {
				rowCellsText.push(cells[i]);
			};

			var row = new GridRow({ cellsText: rowCellsText });
			return row;
		}

		var addRow = function(params){
			var cells = arguments;
				
			var row = addNewRow(cells);
			gridRows.push(row);

			return row;
		};
		
		var addHeader = function(){
			var cells = arguments;

			var headerRow = addNewRow(cells);
			headerRow.isHeader = true;
			gridRows.push(headerRow);

			return headerRow;
		};

		var attachEvent = function(rowHtmlElement){
			var linkedNestedTableRowId = "",
				linkedNestedTableRow = "";

			rowHtmlElement.addEvent("click", function(ev){
				linkedNestedTableRowId = this.attributes["linked-nested-row"].value;
				linkedNestedTableRow = document.getElementById(linkedNestedTableRowId);
				
				if (linkedNestedTableRow.style.display === "none") {
					rowDisplay = "table-row";
				} else {
					rowDisplay = "none";
				};
				
				linkedNestedTableRow.style.display = rowDisplay;
			});
		}

		var render = function(){
			var tHead = "",
				tBody = document.createElement("tbody");

			// If the first row's isHeader is true, define a thead and append.
			// Else, just append t to tbody
			if (gridRows[0] && gridRows[0].isHeader == true) {
				tHead = document.createElement("thead");

				tHead.appendChild(gridRows[0].render());
				table.appendChild(tHead);
			} else {
				tBody.appendChild(gridRows[0]);
			}

			var newRow = "";
			for (var i = 1; i < gridRows.length; i++) {
				newRow = gridRows[i].render();
				attachEvent(newRow);

				tBody.appendChild(newRow);

				if (gridRows[i].nestedGrid.length > 0) {					
					var nestedRow = document.createElement("tr"),
						nestedCell = document.createElement("td"),
						nestedCellId = "nested-table-" + tableRowsCounter + "-holder";

					nestedRow.setAttribute("id", "nested-table-row-holder-" + tableRowsCounter);
					nestedRow.setAttribute("class", "nested-table-row-holder");
					nestedRow.setAttribute("style", "display: none");

					nestedCell.setAttribute("id", nestedCellId);
					nestedCell.setAttribute("colspan", "4");

					nestedRow.appendChild(nestedCell);
					tBody.appendChild(nestedRow);

					table.appendChild(tBody);
					gridHolder.appendChild(table);

					gridRows[i].nestedGrid[0].setHolder("#" + nestedCellId);
					gridRows[i].nestedGrid[0].render();
				};
			};

			table.appendChild(tBody);

			if (gridHolder != "") {
				gridHolder.appendChild(table);	
			};
		};

		var getGridViewData = function(){
			var storageData = [];
			
			function getGridRowsData(grid){

				var gridOutRows = [];
				
				for (var i = 1; i < grid.length; i++) {
					gridOutRows.push(grid[i].rowCells);

					if (grid[i].nestedGrid.length > 0) {
						// console.log(grid[i].nestedGrid)
						// for (var c = 0; c < grid[i].nestedGrid.length; c++) {
						// 	var a = getGridViewData(grid[i].nestedGrid);
						// 	console.log(a)
						// }

						// gridOutRows.push(getGridRowsData(grid[i].rowCells.nestedGrid))
					};
				};

				return gridOutRows;
			}

			var schools = getGridRowsData(gridRows);

			storageData.schools = schools;

			return storageData;
		} 

		return {
			addHeader : addHeader,
			addRow : addRow,
			render : render,
			setHolder : function(holder){
				gridHolder = document.querySelector(holder);
			},
			getGridRows : function(){
				return gridRows;
			},
			getGridViewData : getGridViewData
		}
	};

	var GridRow = function(params){
		this.isHeader = false;
		this.rowCells = [],
		this.nestedGrid = [];
		this.nestedTableDisplay = "none";

		for (var i = 0; i < params.cellsText.length; i++) {
			this.rowCells.push(params.cellsText[i]);
		};

		return this;
	}

	GridRow.prototype = {
		getNestedGridView : function(){
			var nestedGridView = new GridView({ id: "nested" });
			this.nestedGrid.push(nestedGridView);

			return nestedGridView;
		},

		render : function(){
			var rowHtmlElement = document.createElement("tr");
			
			for (var i = 0; i < this.rowCells.length; i++) {
				rowHtmlElement.innerHTML += "<td>" + this.rowCells[i] + "</td>";
			};
			
			tableRowsCounter++;
			
			if (this.nestedGrid.length > 0) {
				var rowThis = this;
				rowHtmlElement.setAttribute("linked-nested-row", "nested-table-row-holder-" + tableRowsCounter);
				rowHtmlElement.setAttribute("class", "nested-table-row-activator");
			}
			
			return rowHtmlElement;
		}
	}

	return {
		getGridView : function(holder){
			var gridView = new GridView({ holder: holder, id: "main" });

			return gridView;			
		},
	}

})();