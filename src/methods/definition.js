export default function (tableList) {
	// console.log(tableList)
	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: {
				uses: "dimensions",
				min: 0,
				max: 1
			},
			setup: {
				label: "Setup",
				type: "items",
				items: {
					tableName: {
						label: "Master table name",
						type: "string",
						component: "dropdown",
						options: tableList,
						defaultValue: "",
						ref: "props.tableId"
					},
					defaultItems: {
						label: "Default items (comma separated)",
						type: "string",
						expression: "optional",
						defaultValue: "",
						ref: "props.defaultItems"
					},
					title: {
						label: "Title",
						type: "string",
						expression: 'optional',
						ref: "props.title",
						defaultValue: ""
					}
				}
			},
			addons: {
				uses: "addons",
				items: {
					dataHandling: {
						uses: "dataHandling"
					}
				}
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
						label: 'Name: CB Custom Report',
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
	}
};
