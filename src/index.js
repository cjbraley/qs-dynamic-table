import {
	initialProperties,
	template,
	definition,
	controller,
	paint,
	resize,
} from "./methods";
import "./style.css";

// This is the object that is ultimately returned to qlik -- this is the extension 

window.define(['qlik', 'jquery'], async function(qlik, $) {

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


	let $scopeRef = undefined;

	return {
		initialProperties,
		template,
		definition: definition(tableList),
		controller: controller(app, qlik),
		paint: function($element, layout){
			$scopeRef = this.$scope;
			return paint($element, layout, this, qlik, $);
		},
		resize,
		support: {
			snapshot: true,
			export: false,
			exportData: false
		},
		getContextMenu: function(qlikApi, addItem){
			addItem.addItem(
				{
                    translation: "Export data",
                    tid: "export",
					icon: "lui-icon lui-icon--export",
					sort: 10,
                    select: function() {
						$scopeRef.exportData()
					}
				}
			)
		}
	}
})
