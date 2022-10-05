
export default async function ($element, layout, self, qlik, $) {

	//////////////////
	// Init
	/////////////////

	const tableId = layout.props.tableId;

	if(layout.props.presetStates.length > 0){
		self.$scope.props.presetStates = layout.props.presetStates;
	}else{
		self.$scope.props.presetStates = [{ name: 'No preset states', state: "", cId: "xyz"}];
	}

	if(!self.$scope.state.selectedState) {
		self.$scope.state.selectedState = self.$scope.props.presetStates[0];
	}


	self.$scope.props.title = layout.props.title;
	self.$scope.props.evaluateVariables = layout.props.evaluateVariables === undefined ? true : layout.props.evaluateVariables;
	self.$scope.props.showCopyToClipboard = layout.props.showCopyToClipboard;

	self.$scope.props.customStyles = layout.props.customStyles || false;
	self.$scope.props.fontSize = layout.props.fontSize || 'unset';
	self.$scope.props.fontColor = layout.props.fontColor || 'unset';
	self.$scope.props.hoverEffect = layout.props.hoverEffect;
	self.$scope.props.hoverColor = layout.props.hoverEffect && layout.props.hoverColor ? layout.props.hoverColor : 'unset';
	self.$scope.props.hoverFontColor = layout.props.hoverEffect && layout.props.hoverFontColor ? layout.props.hoverFontColor : 'unset';


	const state = self.$scope.state;
	const hypercube = layout.qHyperCube;


	await self.$scope.app.getObjectProperties(tableId)
		.then(reply => {
			self.$scope.fullDimensions = reply.properties.qHyperCubeDef.qDimensions.map(dimension => {
				return {
					qLibraryId: dimension.qLibraryId,
					qDef: dimension.qDef,
					qCalcCondition: dimension.qCalcCondition,
					qShowTotal: dimension.qShowTotal,
					qAttributeExpressions: dimension.qAttributeExpressions,
					qShowAll: dimension.qShowAll,
					qOtherTotalSpec: dimension.qOtherTotalSpec,
					qNullSuppression: dimension.qNullSuppression,
					label: dimension.qDef.qFieldLabels[0] ? dimension.qDef.qFieldLabels[0] : dimension.qDef.qFieldDefs[0],
				}
			})


			self.$scope.fullMeasures = reply.properties.qHyperCubeDef.qMeasures.map(measure => {
				return {
					qLibraryId: measure.qLibraryId,
					qDef: measure.qDef,
					qCalcCondition: measure.qCalcCondition,
					qSortBy: measure.qSortBy,
					qAttributeExpressions: measure.qAttributeExpressions,
					label: measure.qDef.qLabel ? measure.qDef.qLabel : measure.qDef.qLabelExpression
				}
			})
		})

	if(self.$scope.props.evaluateVariables){
		if(!self.$scope.baseDimensions){
			await self.$scope.createBaseDimensions(self.$scope.fullDimensions);
		}
		if(!self.$scope.baseMeasures){
			await self.$scope.createBaseMeasures(self.$scope.fullMeasures);
		}


		// create menuItems from base table

		self.$scope.menuDimensions = [];
		self.$scope.menuMeasures = [];
	
		self.$scope.fullDimensions.map(fullDim => {
			return self.$scope.baseDimensions
				.filter(tableDim => fullDim.qDef.cId === tableDim.cId && tableDim.qFallbackTitle)
				.map(tableDim => {
					self.$scope.menuDimensions.push({
						cId: tableDim.cId,
						label: tableDim.qFallbackTitle ? tableDim.qFallbackTitle : null,
						isActive: fullDim.isActive,
						type: "d"
					})
				}
			)
		})
	
		self.$scope.fullMeasures.map(fullMeasure => {
			return self.$scope.baseMeasures
				.filter(tableMeasure => fullMeasure.qDef.cId === tableMeasure.cId && tableMeasure.qFallbackTitle)
				.map(tableMeasure => {
					self.$scope.menuMeasures.push({
						cId: tableMeasure.cId,
						label: tableMeasure.qFallbackTitle ? tableMeasure.qFallbackTitle : null,
						isActive: fullMeasure.isActive,
						type: "m"
					})
				}
			)
		})
	}else {
		self.$scope.menuDimensions = self.$scope.fullDimensions.map(dimension => {
			return {
				cId: dimension.qDef.cId,
				label: dimension.qDef.qFieldLabels[0] ? dimension.qDef.qFieldLabels[0] : dimension.qDef.qFieldDefs[0],
				isActive: undefined,
				type: "d"
			}
		})


		self.$scope.menuMeasures = self.$scope.fullMeasures.map(measure => {
			return {
				cId: measure.qDef.cId,
				label: measure.qDef.qLabel ? measure.qDef.qLabel : measure.qDef.qLabelExpression,
				isActive: undefined,
				type: "m"
			}
		})
	}


	self.$scope.updateStateItems();
	self.$scope.updateMenuState();


	// render table

	if(!self.$element.hasInitialised){
		self.$element.hasInitialised = true;
		self.$scope.retrieveStateFromLocalStorage()
	}
	else if(!self.$scope.table){
		self.$scope.createTable(self.$scope.createSelectedState);
	}else{
		self.$scope.saveStateToLocalStorage()
	}



	return qlik.Promise.resolve();

	// self.resize();
}