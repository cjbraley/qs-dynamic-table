
export default async function ($element, layout, self, qlik, $) {

	// This runs when the data is changed or a property is changed but not when the chart is resized
	// console.log("Paint ran")


	// HELPER FUNCTIONS


	// const initState = (dataArr) => {
	// 	debugger;
	// 	dataArr.map(level => {
	// 		level.expanded = false;
	// 		if(level.children.length > 0){
	// 			initState(level)
	// 		}
	// 	})
	// }

	function handleDataUpdate(displayArr, dataArr) {
		let isInDisplay = null;
		let isInData = null;
		displayArr.map(displayRow => {
			isInData = false;
			dataArr.map(dataRow => {
				// if exists in both
				if (displayRow.id === dataRow.id) {
					isInData = true;
					displayRow.included = true;
					if (displayRow.children.length > 0 && dataRow.children.length > 0) {
						handleDataUpdate(displayRow.children, dataRow.children)
					}
				}
			})
			if (!isInData) {
				displayRow.included = false;
				// set all children of displayRow to have included = false
				if (displayRow.children.length > 0) {
					setPropertyRecursive(displayRow.children, 'included', false)
				}
			}
		})

		// Find what's in data but not in display
		dataArr.map(dataRow => {
			isInDisplay = false;
			displayArr.map(displayRow => {
				// if exists in both
				if (displayRow.id === dataRow.id) {
					isInDisplay = true;
				}
			})

			if(!isInDisplay){
				displayArr.push(dataRow);
			}
		})
	}

	function setPropertyRecursive(arr, propertyName, value) {
		arr.map(arrRow => {
			arrRow[propertyName] = value;
			if (arrRow.children.length) {
				setPropertyRecursive(arrRow.children, propertyName, value);
			}
		})
	}

	// displayRow.included = true;
	// if(displayRow.children.length > 0 && dataRow.children.length > 0){
	// 	handleDataUpdate(displayRow.children, dataRow.children)
	// }

	//////////////////
	// Init
	/////////////////
	const state = self.$scope.state;
	const hypercube = layout.qHyperCube;

	const data = []

	// Receive data and create a nested array
	hypercube.qDataPages[0].qMatrix.map(qRow => {
		qRow.reduce((acc, val) => {
			const rowValue = val.qText;
			const rowId = val.qElemNumber
			// does this value exist at this level?

			let existingValueIndex = -1;


			for (var i = 0; i < acc.length; i++) {
				if (acc[i].id === rowId) {
					existingValueIndex = i;
					break;
				}
			}

			if (existingValueIndex > -1) {
				return acc[existingValueIndex].children
			} else {
				const newData = {
					id: rowId,
					value: rowValue,
					displayValue: rowValue,
					included: true,
					expanded: false,
					search: true,
					children: []
				}
				acc.push(newData)
				return acc[acc.length - 1].children
			}

		}, data)

	});


	// If display doesn't exist, create display as data


	if (!self.$scope.display) {
		self.$scope.display = data;
	} else {
		handleDataUpdate(self.$scope.display, data)
	}

	// run the search process
	self.$scope.searchUpdate(self.$scope.searchString)


	// Initialise state on display (expnaded = false everywhere)




	// Otherwise loop through all values in data and display. Updates to display
	// - If the value is in data but not in display, add it to display. Set "included" to true. Init expanded (false)
	// - If the value is in in data and in display. Set "included" to true
	// - If the value is not in data but is in display, set "included" to false.


	// search through display
	// if there is a match, set textmatch to true. Update the searchValue
	// If there is no match set textMatch to false

	// IF textmatch is true, show the searchValue ELSE show the normal value




	// onSearchChange
	// debounce the change
	// Update the search string and run the search function

	// expandAll 
	// If "inclued" is true, set expanded to true

	// collapseAll
	// if "include" is true, set expanded to false




	// Need something that looks for missing children and adds state segments





	// Take the state and inject it into the display
	// applyState(self.$scope.state, self.$scope.display)







	// self.resize();
	// console.log("end of paint");
}
