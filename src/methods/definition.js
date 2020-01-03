export default {
	type: "items",
	component: "accordion",
	items: {
		dimensions: {
			uses: "dimensions",
			min: 1,
			max: 8
		},
		appearance: {
			uses: "settings",
			type: "items",
		},
		about: {
			type: "items",
			label: "About",
			items: {
				Name: {
					label: 'Name: Collapsible Accordion',
					component: 'text'
				},
				Version: {
					label: 'Version: 1.0.0',
					component: 'text'
				},
				Author: {
					label: 'Author: Christopher Braley',
					component: 'text'
				},
			}
		}
	}
};
