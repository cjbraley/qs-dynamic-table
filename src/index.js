import {
	initialProperties,
	template,
	definition,
	controller,
	paint,
	resize,
} from "./methods";
import "./style.css";

// import sortable from '../static/sortable.min';

// This is the object that is ultimately returned to qlik -- this is the extension 

window.define(['qlik', 'jquery'], async function(qlik, $) {


	// ,'angular','qvangular','./static/sortable.min'
	// , angular, qvangular, sortable
	// console.log(angular)
	// // console.log(qvangular)

	// // qvangular.module.requires.push('ui.sortable')
	// // qvangular = qvangular.module('qlik-angular', [...qvangular.module.requires,'ui.sortable'])

	
	
	// var myAppModule = angular.module('qlik-angular', ['ui.sortable'])
	// console.log(myAppModule)
	
	// console.log(qvangular)

	const app = await qlik.currApp();

	const getMasterTableList = new Promise((resolve, reject) => {

		app.getAppObjectList("masterobject", (objectList) => {
			resolve(objectList.qAppObjectList.qItems
				.filter(object => {
					return object.qData.visualization === "table" ? true : false;
				})
				.map(filteredObject => ({
						label: filteredObject.qMeta.title,
						value: filteredObject.qInfo.qId
			}))
			)
		});
	

	})

	const tableList = await getMasterTableList;

	return {
		initialProperties,
		template,
		definition: definition(tableList),
		controller: controller(app, qlik),
		paint: function($element, layout){
			return paint($element, layout, this, qlik, $);
		},
		resize,
		support: {
			snapshot: true,
			export: false,
			exportData: false
		}
	}
})
