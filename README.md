# qs-custom-report
Qlik Sense extension that allows users to create their own tables from a list of dimensions and measures

![Thumb](https://github.com/cjbraley/qs-custom-report/blob/master/demo/thumb.jpg)

# Installation

Download [dist/qs-custom-report.zip](https://github.com/cjbraley/qs-custom-report/raw/master/dist/CB%20Custom%20Report.zip), upload to Qlik server or extract to appropriate folder.

Qlik Sense Desktop: unzip to a directory under Documents/Qlik/Sense/Extensions.

Qlik Sense Server: import the zip file in the QMC.

# Demo

## Getting Started

QS Custom Report allows the user to create their own tables. Included features are show in the gif below.

![List](https://github.com/cjbraley/qs-custom-report/blob/master/demo/demo.gif)

Setup instructions:
1. Create a master table that includes the dimensions and measures you would like to be available
2. Add a QS Custom Report object to your page
3. Go to the Setup properties panel
    * Select the master table from Step 1
    * List the dimensions and measure you would like to appear by default, separated by commas
    * Add a title (Optional)

![Basic config](https://github.com/cjbraley/qs-custom-report/blob/master/demo/demo_config.jpg)

## Using variables

QS Custom Report supports the use of variables in your dimension and measure names.

![Using a variable](https://github.com/cjbraley/qs-custom-report/blob/master/demo/demo_variable.jpg)

In order for a variable to update, it must be included in the dimension property. This is required for Qlik Sense to know that the QS Custom Report object depends on the variable in question.

![Adding your variable](https://github.com/cjbraley/qs-custom-report/blob/master/demo/demo_variable_config_dimensions.gif)

![Update your default items](https://github.com/cjbraley/qs-custom-report/blob/master/demo/demo_variable_config_setup.gif)

# License
MIT
