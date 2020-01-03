
export default async function ($element, layout, self, qlik, $) {

	// This runs when the data is changed or a property is changed but not when the chart is resized
	// console.log("Paint ran")

	//////////////////
	// Init
	/////////////////
	const state = self.$scope.state;
	const hypercube = layout.qHyperCube;

	const data = []

	hypercube.qDataPages[0].qMatrix.map(qRow => {
		qRow.reduce((acc, val) => {
			const rowValue = val.qText;
			const rowId = val.qElemNumber
			// does this value exist at this level?
			
			let existingValueIndex = -1;


			for(var i = 0; i < acc.length; i++) {
				if(acc[i].id === rowId) {
					existingValueIndex = i;
					break;
				}
			}

			if(existingValueIndex > -1) {
				return acc[existingValueIndex].children
			}else{
				const newData = {
					id: rowId,
					value: rowValue,
					expanded: false,
					search: true,
					children: []
				}
				acc.push(newData)
				return acc[acc.length - 1].children
			}

		}, data)

	})


	if(!self.$scope.state || self.$scope.state.length < data.length){

		function generateState(objArray){
			return objArray.map(obj => {
				const newObj = {
					id: obj.id,
					expanded: false,
				}
				newObj.children = obj.children.length > 0 ? generateState(obj.children) : [];
				// console.log(newObj)
				return newObj
			})
		}

		const state = generateState(data);		

		self.$scope.state = state;
	}

	function applyState(state, data){
		state.map(stateRow => {
			data.map(dataRow => {
				if(stateRow.id === dataRow.id){
					dataRow.expanded = stateRow.expanded;
					if(stateRow.children.length > 0 && dataRow.children.length > 0){
						applyState(stateRow.children, dataRow.children)
					}
				}
			})
		})

	}

	applyState(self.$scope.state, data)


	self.$scope.data = data;





	

	// var array = ['opt1','sub1','subsub1','subsubsub1'];
	// var object = {};
	// array.reduce(function(o, s) { return o[s] = {}; }, object);
	// console.log(object);

	// console.log(data)
	// console.log(hypercube)
	// console.log(state);



	// self.resize();
	// console.log("end of paint");
}
