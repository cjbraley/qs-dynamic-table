export default [
	"$scope",
	"$element",
	function ($scope, $element) {

		// everything that is static can be defined here (things we don't need to repeat in pain or resize)

		$scope.data = {};
		$scope.searchString = '';


		// need to keep the state of what is expanded and what is collapsed
		// $scope.state = {};


		$scope.toggleExpanded = function (event, item) {
			event.stopPropagation()
			item.expanded = !item.expanded;
		}

		// Expand All / collapse all function
		$scope.toggleAll = function (arr, toState) {
			arr.map(arrRow => {
				if(arrRow.included && arrRow.search){
					arrRow.expanded = toState;
				}
				if (arrRow.children.length > 0) {
					$scope.toggleAll(arrRow.children, toState)
				}
			})
		}

		$scope.expandAll = function () {
			$scope.toggleAll($scope.display, true)
		}

		$scope.collapseAll = function () {
			$scope.toggleAll($scope.display, false)
		}

		// Search function
		$scope.searchText = function (arr, text, parentMatch) {
			$scope.searchInProgress = true;
			let searchMatch;
			arr.map(arrRow => {
				if (!arrRow.value) {
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

		$scope.highlightSearchText = function (arr, text) {
			const display = arr.map(arrRow => {
				let value = arrRow.value;
				let children = arrRow.children;
				if (arrRow.value && text.length > 2) {
					const exp = new RegExp(text, "gi")
					value = value.replace(exp, `<span class="highlight">$&</span>`);
				}
				if (arrRow.children.length > 0) {
					children = $scope.highlightSearchText(arrRow.children, text)
				}
				return {
					...arrRow,
					displayValue: value,
					children: children
				}
			})

			$scope.searchInProgress = false;
			return display;

		}


		$scope.searchUpdate = debounce(function (text) {
			$scope.searchString = text;
			$scope.searchText($scope.display, text, false);
			$scope.display = $scope.highlightSearchText($scope.display, text)
		},200)

		function debounce(func, delay) { 
			let debounceTimer 
			return function() { 
				const context = this
				const args = arguments 
					clearTimeout(debounceTimer) 
					debounceTimer = setTimeout(() => func.apply(context, args), delay) 
			} 
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
