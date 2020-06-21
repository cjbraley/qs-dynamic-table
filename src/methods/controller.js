
export default function (app, qlik) {
	return [
		"$scope",
		"$element",
		function ($scope, $element) {

			// INIT
			$scope.app = app;
			$scope.localStorageKey = `QSCR_${app.id}_${$scope.$parent.layout.qInfo.qId}`;
			$scope.isLoading = true;
			$scope.props = {};
			$scope.state = {
				mode: 'table',
				column: [],
				row: [],
				measure: []
			}
			$scope.table = undefined;
			$scope.baseTable = undefined;
			$scope.menuDimensions = []
			$scope.menuMeasures = []
			$scope.activeDimensions = [];
			$scope.activeMeasures = [];
			$scope.retrievedSortOrder = [];

			$('#cbcr__column, #cbcr__row, #cbcr__measure').sortable({
				// connectWith: ".connected-sortable",
				opacity: 0.6,
				delay: 150,
				start: function (event, ui) {
					$scope.sortOriginIndex = ui.item.index();
					$scope.sortOriginList = event.target.id.split('__')[1];
				},
				update: function (event, ui) {
					if (this === ui.item.parent()[0]) {
						const sortTargetIndex = ui.item.index();
						const sortTargetList = event.target.id.split('__')[1];
						const removed = $scope.state[$scope.sortOriginList][$scope.sortOriginIndex];
						$scope.state[$scope.sortOriginList].splice($scope.sortOriginIndex, 1);
						$scope.state[sortTargetList].splice(sortTargetIndex, 0, removed)
						$scope.updateTable()
						$scope.$apply();
					}
				}
			}).disableSelection();

			// PAINT FUNCTIONS

			$scope.createBaseDimensions = async function (dimensions) {
				$scope.baseDimensions = new Array(dimensions.length);
				let i = 0;
				for (let dimension of dimensions) {
					const index = i;
					const newDimension = await app.createCube({
						qDimensions: [dimension],
						qMeasures: [],
						qInitialDataFetch: [{
							qTop: 0,
							qLeft: 0,
							qHeight: 0,
							// qWidth : 3
						}]
					}, function (reply) {
						$scope.baseDimensions[index] = reply.qHyperCube.qDimensionInfo[0]
					})
					i++
				}
			};

			$scope.createBaseMeasures = async function (measures) {
				$scope.baseMeasures = new Array(measures.length);
				let i = 0;
				for (let measure of measures) {
					const index = i;
					const newMeasure = await app.createCube({
						qMeasures: [measure],
						qInitialDataFetch: [{
							qTop: 0,
							qLeft: 0,
							qHeight: 0,
							// qWidth : 3
						}]
					}, function (reply) {
						$scope.baseMeasures[index] = reply.qHyperCube.qMeasureInfo[0]
					})
					i++
				}
			};

			$scope.updateStateItems = function () {
				let exists;
				$scope.state.column = $scope.state.column.filter(item => {
					$scope.menuDimensions.map(dimension => {
						if (dimension.cId === item.cId) {
							item.label = dimension.label;
							exists = true
						}
					})
					return exists;
				})

				$scope.state.row = $scope.state.row.filter(item => {
					let exists = false
					$scope.menuDimensions.map(dimension => {
						if (dimension.cId === item.cId) {
							item.label = dimension.label;
							exists = true
						}
					})
					return exists;
				})

				$scope.state.measure = $scope.state.measure.filter(item => {
					let exists = false
					$scope.menuMeasures.map(measure => {
						if (measure.cId === item.cId) {
							item.label = measure.label;
							exists = true
						}
					})
					return exists;
				})
			};

			$scope.updateMenuState = function () {
				[
					...$scope.state.column,
					...$scope.state.row,
					...$scope.state.measure,
				].map(item => {
					$scope.menuDimensions.map(dimension => {
						if (dimension.cId === item.cId) {
							dimension.isActive = true;
						}
					})

					$scope.menuMeasures.map(measure => {
						if (measure.cId === item.cId) {
							measure.isActive = true;
						}
					})
				})
			};


			// BUTTON FUNCTIONS

			$scope.toggleMode = async function (mode) {
				$scope.table.close();
				$scope.state.mode = mode;
				if (mode === 'table') {
					$scope.state.column = [...$scope.state.column, ...$scope.state.row];
					$scope.state.row = [];
				}
				$scope.createTable($scope.updateTable);
			}

			$scope.removeButton = function (type, id) {
				$scope.removeItemById(type, id);
				$scope.updateTable();
			}

			$scope.swapDimension = function (fromType, item) {
				const toType = fromType === 'row' ? 'column' : 'row';
				$scope.state[fromType].map((stateItem, i) => {
					if (stateItem.cId === item.cId) $scope.state[fromType].splice(i, 1);
				})
				$scope.state[toType].push(item);
				$scope.updateTable();
			}

			$scope.expandAll = function () {
				$scope.app.getObject($scope.table.id)
					.then(table => {
						table.expandTop("/qHyperCubeDef", 0, 0, true)
						return table.expandLeft("/qHyperCubeDef", 0, 0, true)
					})
					.catch(err => {
						console.log(err);
					})
			};

			$scope.collapseAll = function () {
				$scope.app.getObject($scope.table.id)
					.then(table => {
						table.collapseTop("/qHyperCubeDef", 0, 0, true)
						return table.collapseLeft("/qHyperCubeDef", 0, 0, true)
					})
					.catch(err => {
						console.log(err);
					})
			};

			$scope.menuToggleActive = function (type, id) {
				if (type === 'd') {
					if (this.dimension.isActive) {
						$scope.removeItemById('d', id);
					} else {
						$scope.addToState('column', {
							cId: id,
							label: this.dimension.label,
							type: "d"
						})
					}
				}

				if (type === 'm') {
					if (this.measure.isActive) {
						$scope.removeItemById('m', id)
					} else {
						$scope.addToState('measure', {
							cId: id,
							label: this.measure.label,
							type: "m"
						})
					}
				}
				$scope.updateTable()
			};


			$scope.removeItemById = function (type, id) {
				if (type === 'd') {
					let index = $scope.state.column.map(item => item.cId).indexOf(id);
					if (index > -1) {
						$scope.state.column.splice(index, 1);
						$scope.removedColumnTableIndex = index;
						return $scope.setIsActive($scope.menuDimensions, id, false)
					}
					index = $scope.state.row.map(item => item.cId).indexOf(id);
					if (index > -1) {
						$scope.state.row.splice(index, 1);
						$scope.removedColumnTableIndex = index + $scope.state.row.length;
						return $scope.setIsActive($scope.menuDimensions, id, false)
					}
				} else {
					const index = $scope.state.measure.map(item => item.cId).indexOf(id);
					if (index > -1) {
						$scope.state.measure.splice(index, 1);
						$scope.removedColumnTableIndex = index + $scope.state.row.length + $scope.state.column.length;
					}
					$scope.setIsActive($scope.menuMeasures, id, false)
				}
			}




			// HELPER FUNCTIONS

			$scope.addToState = function (location, item) {
				$scope.addedToIndex = $scope.state[location].push(item) - 1;
				if (location == 'measure') $scope.addedToIndex += $scope.state.column.length;
				$scope.setIsActive($scope.menuDimensions, item.cId, true)
				$scope.setIsActive($scope.menuMeasures, item.cId, true)
			}

			$scope.setIsActive = function (arr, id, val) {
				arr.map(item => {
					if (item.cId === id) {
						item.isActive = val;
					}
				})
			};

			$scope.createActiveItems = function () {
				let itemCount = 0;
				$scope.activeDimensions = $scope.fullDimensions.filter(dimension => {
					let exists = false;
					[
						...$scope.state.column,
						...$scope.state.row
					].map((stateItem, index) => {
						if (stateItem.cId === dimension.qDef.cId) {
							exists = true;
							itemCount++
							dimension.sortIndex = index;
						}
					})
					return exists;
				}).sort((a, b) => a.sortIndex - b.sortIndex);

				$scope.activeMeasures = $scope.fullMeasures.filter(measure => {
					let exists = false;
					$scope.state.measure.map((stateItem, index) => {
						if (stateItem.cId === measure.qDef.cId) {
							exists = true;
							itemCount++
							measure.sortIndex = $scope.activeDimensions.length + index;
						}
					})
					return exists;
				}).sort((a, b) => a.sortIndex - b.sortIndex)

				$scope.sortOrder = new Array(itemCount);

				[
					...$scope.activeDimensions,
					...$scope.activeMeasures
				].map((item, index) => {
					$scope.sortOrder[item.sortIndex] = index;
				})
			}

			$scope.setInterColumnSortOrder = function (manualOrder = null) {
				let qInterColumnSortOrder;
				if ($scope.retrievedSortOrder.length > 0) {
					qInterColumnSortOrder = $scope.retrievedSortOrder;
					$scope.retrievedSortOrder = [];
				}
				else if (manualOrder) {
					qInterColumnSortOrder = manualOrder;
				} else {
					qInterColumnSortOrder = $scope.table.table.qHyperCube.qEffectiveInterColumnSortOrder;
					if (qInterColumnSortOrder.length > $scope.sortOrder.length && $scope.removedColumnTableIndex > -1) {
						qInterColumnSortOrder = qInterColumnSortOrder.filter(columnIndex => columnIndex != $scope.removedColumnTableIndex);
						qInterColumnSortOrder = qInterColumnSortOrder.map(columnIndex => columnIndex >= $scope.removedColumnTableIndex ? columnIndex - 1 : columnIndex);
					} else if (qInterColumnSortOrder.length < $scope.sortOrder.length) {
						qInterColumnSortOrder = qInterColumnSortOrder.map(columnIndex => columnIndex >= $scope.addedToIndex ? columnIndex + 1 : columnIndex);
					}
				}
				$scope.state.qInterColumnSortOrder = qInterColumnSortOrder;
				$scope.removedColumnTableIndex = -1;
			}

			$scope.updateTable = function (manualSortOrder) {
				// $scope.isUpdating = true;
				$scope.createActiveItems();

				$scope.setInterColumnSortOrder(manualSortOrder);

				let patches;
				if ($scope.state.mode === 'table') {
					patches = [{
						qOp: "replace",
						qPath: "qHyperCubeDef/qDimensions",
						qValue: JSON.stringify($scope.activeDimensions)
					}, {
						qOp: "replace",
						qPath: "qHyperCubeDef/qMeasures",
						qValue: JSON.stringify($scope.activeMeasures)
					}
						, {
						qOp: "replace",
						qPath: "qHyperCubeDef/qColumnOrder",
						qValue: JSON.stringify($scope.sortOrder)
					}
						, {
						qOp: "replace",
						qPath: "qHyperCubeDef/columnOrder",
						qValue: JSON.stringify($scope.sortOrder)
					},
					{
						qOp: "replace",
						qPath: "qHyperCubeDef/qInterColumnSortOrder",
						qValue: JSON.stringify($scope.state.qInterColumnSortOrder)
					}
					];
				} else {
					patches = [{
						qOp: "replace",
						qPath: "qHyperCubeDef/qDimensions",
						qValue: JSON.stringify($scope.activeDimensions)
					}, {
						qOp: "replace",
						qPath: "qHyperCubeDef/qMeasures",
						qValue: JSON.stringify($scope.activeMeasures)
					},
					// 	, {
					// 	qOp: "replace",
					// 	qPath: "qHyperCubeDef/qColumnOrder",
					// 	qValue: JSON.stringify($scope.sortOrder)
					// },
					{
						qOp: "replace",
						qPath: "qHyperCubeDef/qInterColumnSortOrder",
						qValue: JSON.stringify($scope.state.qInterColumnSortOrder)
					},
					{
						qOp: "replace",
						qPath: "qHyperCubeDef/qNoOfLeftDims",
						qValue: JSON.stringify($scope.state.column.length)
					},
					{
						qOp: "replace",
						qPath: "qHyperCubeDef/qIndentMode",
						qValue: JSON.stringify(false)
					}
					];
				}


				$scope.app.getObject($scope.table.id)
					.then(table => {
						table.clearSoftPatches();
						return table.applyPatches(patches, false);
					})
					// .then(table => {
					// 	return table.applyPatches(patches, false);
					// })
					.catch(err => {
						// $scope.isUpdating = false;
						alert('Unable to refresh. Please try again.');
					})

				$scope.saveStateToLocalStorage();
			};

			$scope.exportData = function () {
				if ($scope.state.column.length + $scope.state.row.length + $scope.state.measure.length > 0) {
					$scope.app.getObject($scope.table.id)
						.then(table => {
							const data = qlik.table(table);
							data.exportData({ download: true });
						})
				}
			}

			$scope.clearAll = function (updateTable = false) {
				$scope.state.column = [];
				$scope.state.row = [];
				$scope.state.measure = [];
				$scope.menuDimensions.map(dimension => dimension.isActive = false);
				$scope.menuMeasures.map(measure => measure.isActive = false);
				if(updateTable) {
					$scope.updateTable();
				}
			};

			$scope.copyStateToClipboard = function () {

				const stateLabelsArray = [
					...$scope.state.column,
					...$scope.state.row,
					...$scope.state.measure,
				]
				.map(item => item.label);

				const stateText = stateLabelsArray.filter((item, i) => stateLabelsArray.indexOf(item) === i).join(',');
				
				navigator.clipboard.writeText(stateText)
					.catch(err => {
						console.error('Async: Could not copy text: ', err);
					});
			}

			$scope.saveStateToLocalStorage = function () {
				const stateJSON = JSON.stringify($scope.state);
				localStorage.setItem($scope.localStorageKey, stateJSON)
			}

			// $scope.createTable = async function (dimensions, measures) {
			// 	return $scope.app.visualization.create($scope.state.mode,
			// 		[
			// 			...dimensions,
			// 			...measures,
			// 		],
			// 	)
			// };

			$scope.createTable = async function(nextCall){
				$scope.table = await $scope.app.visualization.create($scope.state.mode,[]);
				$scope.isLoading = false;
				$scope.table.show("cbcr__table")
					.then(reply => {
						nextCall()
					})
			}

			$scope.retrieveStateFromLocalStorage = async function () {
				$scope.retrievedSortOrder = [];
				const retrievedState = JSON.parse(localStorage.getItem($scope.localStorageKey));
				if (retrievedState) {
					// If the retrieved state does not exists in the currently available presets, then do the base case
					const retrievedStateName = retrievedState.selectedState.name;
					const retrievedPresetIsAvailable = $scope.props.presetStates.reduce((acc,el) => acc || el.name === retrievedStateName, false);
					if(retrievedPresetIsAvailable){
						$scope.retrievedSortOrder = retrievedState.qInterColumnSortOrder;
						$scope.state = retrievedState;
						$scope.createTable($scope.applyState);
						return;
					}
					//

				}
				$scope.createTable($scope.createSelectedState);
			}

			$scope.createSelectedState = function () {
				$scope.clearAll();

				setTimeout(() => {
					if ($scope.state.selectedState) {

						const items = $scope.state.selectedState.state.split(',');
	
						items.map(item => {
							$scope.menuDimensions.map(menuItem => {
								if (item === menuItem.label) {
									$scope.state.column.push({
										cId: menuItem.cId,
										label: menuItem.label,
										type: menuItem.type
									})
								}
							})
	
							$scope.menuMeasures.map(menuItem => {
								if (item === menuItem.label) {
									$scope.state.measure.push({
										cId: menuItem.cId,
										label: menuItem.label,
										type: menuItem.type
									})
								}
							})
						})
	
						$scope.applyState(Array.from(Array(items.length).keys()));
					}
				},200)


			}

			$scope.applyState = function (manualSortOrder) {

				$scope.menuDimensions.map(menuItem => {
					$scope.state.column.map(stateItem => {
						if (stateItem.cId === menuItem.cId) {
							menuItem.isActive = true;
						}
					})
					$scope.state.row.map(stateItem => {
						if (stateItem.cId === menuItem.cId) {
							menuItem.isActive = true;
						}
					})
				})

				$scope.menuMeasures.map(menuItem => {
					$scope.state.measure.map(stateItem => {
						if (stateItem.cId === menuItem.cId) {
							menuItem.isActive = true;
						}
					})
				})

				$scope.updateTable(manualSortOrder);
			};

		},
	]
} 
