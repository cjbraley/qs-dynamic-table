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

window.define(['qlik', 'jquery'], function(qlik, $) {
	return {
		initialProperties,
		template,
		definition,
		controller,
		paint: function($element, layout){
			return paint($element, layout, this, qlik, $);
		},
		resize,
		support: {
			snapshot: true,
			export: true,
			exportData: true
		}
	}
})
