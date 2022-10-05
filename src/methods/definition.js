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
					},
					evaluateVariables: {
						type: "boolean",
						component: "switch",
						label: "Dynamic menu items",
						ref: "props.evaluateVariables",
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
				items: {
					styles: {
						label: 'Presentation',
						type: "items",
						items: {
							customStyles: {
								type: "boolean",
								component: "switch",
								label: "Custom Styling",
								ref: "props.customStyles",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
		
							},
							fontSize: {
								label: "Content font size",
								ref: "props.fontSize",
								type: "string",
								expression: "optional",
								component: 'expression',
								defaultValue: "",
								show: (layout) => {
									return layout.props.customStyles
								}
							},
							fontColor: {
								label: "Content font color ",
								ref: "props.fontColor",
								type: "string",
								expression: "optional",
								component: 'expression',
								defaultValue: "",
								show: (layout) => {
									return layout.props.customStyles
								}
							},
							hoverEffect: {
								type: "boolean",
								component: "switch",
								label: "hoverEffect",
								ref: "props.hoverEffect",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
								show: (layout) => {
									return layout.props.customStyles
								}
							},
							hoverColor: {
								label: "Row hover color ",
								ref: "props.hoverColor",
								type: "string",
								expression: "optional",
								component: 'expression',
								defaultValue: "='#eee'",
								show: (layout) => {
									return layout.props.customStyles && layout.props.hoverEffect
								}
							},
							hoverFontColor: {
								label: "Row hover font color ",
								ref: "props.hoverFontColor",
								type: "string",
								expression: "optional",
								component: 'expression',
								defaultValue: "",
								show: (layout) => {
									return layout.props.customStyles && layout.props.hoverEffect
								}
							}
						}
					}
				}
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
