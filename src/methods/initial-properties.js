export default {
	qHyperCubeDef: {
		qDimensions: [],
		qMeasures: [],
		qInitialDataFetch: [
			// set this to the max number of dimensions
			// Qlik is limited to 10,000 cells so qHeight should not be more than 10,000 / qWidth  
			{
				qWidth: 5,
				qHeight: 2000,
			},
		],
	}
}
