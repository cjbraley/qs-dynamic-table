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
					},
					showCopyToClipBoard: {
						type: "boolean",
						component: "switch",
						label: "Show copy to clipboard",
						ref: "props.showCopyToClipboard",
						options: [{
							value: true,
							label: "Yes"
						}, {
							value: false,
							label: "No"
						}],
						defaultValue: true
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
						allowMove: true,
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
