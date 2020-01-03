export default [
	"$scope",
	"$element",
	function ($scope, $element) {

		// everything that is static can be defined here (things we don't need to repeat in pain or resize)

		$scope.data = {};

		// need to keep the state of what is expanded and what is collapsed
		// $scope.state = {};

		$scope.updateState = function (state, data) {
			state.map(stateRow => {
				data.map(dataRow => {
					if (stateRow.id === dataRow.id) {
						// debugger
						stateRow.expanded = dataRow.expanded;
						if (stateRow.children.length > 0 && dataRow.children.length > 0) {
							$scope.updateState(stateRow.children, dataRow.children)
						}
					}
				})
			})
		}

		$scope.toggleExpanded = function (event, item) {
			event.stopPropagation()
			// update data
			item.expanded = !item.expanded;
			// update state
			$scope.updateState($scope.state, $scope.data)


			// if(!item.expanded){
			//     $scope.collapseChildren(item);
			// }

		}

		// Expand All / collapse all function
		$scope.toggleAll = function (arr, toState) {
			arr.map(arrRow => {
				arrRow.expanded = toState;
				if (arrRow.children.length > 0) {
					$scope.toggleAll(arrRow.children, toState)
				}
			})
		}

		$scope.expandAll = function () {
			console.log('ran')
			$scope.toggleAll($scope.data, true)
			$scope.toggleAll($scope.state, true)
		}

		$scope.collapseAll = function () {
			$scope.toggleAll($scope.data, false)
			$scope.toggleAll($scope.state, false)
		}

		// Search function
		$scope.searchText = function (arr, text, parentMatch) {
			let searchMatch;
			arr.map(arrRow => {
				if(!arrRow.value){
					arrRow.search = false;
					searchMatch = false;
					return
				}
				if (parentMatch) {
					arrRow.search = true;
					searchMatch = true;
					if (arrRow.children.length > 0) {
						$scope.searchText(arrRow.children, text, true)
					}
				} else if (arrRow.value.toLowerCase().includes(text.toLowerCase())) {
					arrRow.search = true;
					searchMatch = true;
					if (arrRow.children.length > 0) {
						$scope.searchText(arrRow.children, text, true)
					}
				} else {
					if (arrRow.children.length > 0) {
						arrRow.search = $scope.searchText(arrRow.children, text, false)
						if (!searchMatch) {
							searchMatch = arrRow.search
						}
					} else {
						arrRow.search = false;
						if (!searchMatch) {
							searchMatch = false
						}
					}
				}
			})
			return searchMatch

		}

		$scope.searchUpdate = function(text) {
			// console.log(event)
			$scope.searchText($scope.data, text, false)
			// console.log($scope.data)
		}


		// $scope.collapseChildren = function(item){
		//     if(item.children){
		//         for (i in item.children){
		//             const child = item.children[i]
		//             child.expanded = false;
		//             $scope.collapseChildren(child)
		//         }

		//     }
		// }





	},
]
