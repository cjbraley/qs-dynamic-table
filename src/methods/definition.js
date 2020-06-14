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
					title: {
						label: "Title",
						type: "string",
						expression: 'optional',
						ref: "props.title",
						defaultValue: ""
					}
				}
			},
			states: {
				label: 'Preset states',
				type: 'items',
				items: {
					options: {
						type: 'array',
						ref: 'props.presetStates',
						label: 'Preset states',
						itemTitleRef: 'name',
						allowAdd: true,
						allowRemove: true,
						addTranslation: 'Add preset',
						items: {
							name: {
								type: 'string',
								ref: 'name',
								label: 'Name',
								expression: 'optional'
							},
							value: {
								type: 'string',
								ref: 'state',
								label: 'State',
								expression: 'optional'
							}
						}
					},
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
						label: 'Version: 1.1.0',
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
