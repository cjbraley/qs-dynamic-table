
import Sortable from 'sortablejs';

export default function (app, qlik) {
	return [
		"$scope",
		"$element",
		function ($scope, $element) {

			// console.log("Controller started")


			// everything that is static can be defined here (things we don't need to repeat in pain or resize)

			$scope.app = app;
			$scope.props = {};
			$scope.state = [];
			$scope.table = undefined;
			$scope.baseTable = undefined;
			$scope.menuDimensions = []
			$scope.menuMeasures = []
			$scope.activeDimensions = [];
			$scope.activeMeasures = [];


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


			}

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
			}


			$scope.createTable = async function (dimensions, measures) {

				return $scope.app.visualization.create('table',
					[
						...dimensions,
						...measures,
					],
				)

			}



			$scope.sortConfig = {
				animation: 150,
				ghostClass: "cbcr__ghost",
				onSort: function (event) {
					const removed = $scope.state.splice(event.oldIndex, 1)[0];
					$scope.state.splice(event.newIndex, 0, removed)
					$scope.updateTable()
				}
			}

			const sortContainer = document.getElementById('cbcr__config');
			const sortable = Sortable.create(sortContainer, $scope.sortConfig);


			$scope.menuToggleActive = function (type, id) {
				if (type === 'd') {
					if (this.dimension.isActive) {
						$scope.removeItemById(id)
					} else {
						$scope.addToState({
							cId: id,
							label: this.dimension.label,
							type: "d"
						})
					}
				}

				if (type === 'm') {
					if (this.measure.isActive) {
						$scope.removeItemById(id)
					} else {
						$scope.addToState({
							cId: id,
							label: this.measure.label,
							type: "m"
						})
					}
				}
				$scope.updateTable()
			}

			$scope.updateMenuState = function () {
				$scope.state.map(item => {
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
			}

			$scope.updateStateItems = function () {

				$scope.state = $scope.state.filter(item => {
					let exists = false
					$scope.menuDimensions.map(dimension => {
						if (dimension.cId === item.cId) {
							item.label = dimension.label;
							exists = true
						}
					})

					$scope.menuMeasures.map(measure => {
						if (measure.cId === item.cId) {
							item.label = measure.label;
							exists = true
						}
					})

					return exists;
				})
			}

			$scope.removeItemById = function (id) {
				const index = $scope.state.map(item => item.cId).indexOf(id);
				if (index > -1) {
					$scope.state.splice(index, 1);
				}
				$scope.setIsActive($scope.menuDimensions, id, false)
				$scope.setIsActive($scope.menuMeasures, id, false)
			}

			$scope.addToState = function (item) {
				$scope.state.push(item);
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

			$scope.removeButton = function (id) {
				$scope.removeItemById(id);
				$scope.updateTable();
			}


			$scope.createActiveDimensions = function () {
				let dimensionCount = 0;
				$scope.activeDimensions = $scope.fullDimensions.filter(dimension => {
					let exists = false;
					$scope.state.map((stateItem, index) => {
						if (stateItem.cId === dimension.qDef.cId) {
							exists = true;
							$scope.sortOrder[index] = dimensionCount;
							dimensionCount++
							dimension.sortIndex = index;
						}
					})
					return exists;
				})
			}

			$scope.createActiveMeasures = function () {
				$scope.activeMeasures = $scope.fullMeasures.filter(measure => {
					let exists = false;
					$scope.state.map((stateItem, index) => {
						if (stateItem.cId === measure.qDef.cId) {
							exists = true;
							measure.sortIndex = index;
						}
					})
					return exists;
				})
			}

			$scope.createActiveItems = function () {
				let itemCount = 0;
				$scope.activeDimensions = $scope.fullDimensions.filter(dimension => {
					let exists = false;
					$scope.state.map((stateItem, index) => {
						if (stateItem.cId === dimension.qDef.cId) {
							exists = true;
							itemCount++
							dimension.sortIndex = index;
						}
					})
					return exists;
				})

				$scope.activeMeasures = $scope.fullMeasures.filter(measure => {
					let exists = false;
					$scope.state.map((stateItem, index) => {
						if (stateItem.cId === measure.qDef.cId) {
							exists = true;
							itemCount++
							measure.sortIndex = index;
						}
					})
					return exists;
				})


				$scope.sortOrder = new Array(itemCount);

				[
					...$scope.activeDimensions,
					...$scope.activeMeasures
				].map((item, index) => {
					$scope.sortOrder[item.sortIndex] = index;
				})

			}

			$scope.updateTable = function () {
				$scope.isUpdating = true;
				$scope.createActiveItems();

				const patches = [{
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
					qValue: JSON.stringify($scope.sortOrder)
				}
				];
				$scope.app.getObject($scope.table.id)
					.then(table => {
						return table.applyPatches(patches, false);
					})
					.then(reply => {
						$scope.isUpdating = false;
					})
					.catch(err => {
						$scope.isUpdating = false;
						alert('Unable to refresh. Please try again.');
					})
			};

			$scope.exportData = function () {
				if ($scope.state.length > 0) {
					$scope.app.getObject($scope.table.id)
						.then(table => {
							const data = qlik.table(table);
							data.exportData({ download: true });
						})
				}
			}

			$scope.clearAll = function () {
				$scope.state = [];
				$scope.menuDimensions.map(dimension => dimension.isActive = false);
				$scope.menuMeasures.map(measure => measure.isActive = false);
				$scope.updateTable();
			};

			$scope.applyDefaultState = function () {
				if ($scope.props.defaultItems) {
					$scope.clearAll();
					const items = $scope.props.defaultItems.split(',');

					items.map(item => {

						[
							...$scope.menuDimensions,
							...$scope.menuMeasures
						].map(menuItem => {
							if (item === menuItem.label) {
								menuItem.isActive = true;
								$scope.state.push({
									cId: menuItem.cId,
									label: menuItem.label,
									type: menuItem.type
								})
							}
						})
					})


					$scope.updateTable();
				}
			};

			// console.log('Controller end')
		},
	]
} 
