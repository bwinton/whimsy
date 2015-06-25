# whimsy
> An addon to add some whimsperiments to your Firefox…

## Prerequisites

- [Mozilla Firefox, version 34 or later](https://www.mozilla.org/en-US/firefox/new/)
- [`node` and `npm`](https://nodejs.org/) 
- [`jpm`](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm) 
- [`grunt`](http://gruntjs.com/): `$ npm install -g grunt-cli`

## Up and Running

0. Install the prereqs (see above)
1. Fork and clone this repository
2. Run the project using: `$ jpm run`

## Scripts

whimsy uses the `grunt` task runner to define several tasks:

- `amo`: Build the add-on for AMO
- `copy`: Copy the files to the server
- `deploy`: Build the add-on and copy the files
- `run`: Run a testing version of the add-on
- `fennec`: Run a testing version of the add-on on Android
- `test`: Run the tests for the add-on

To run these tasks, use `$ grunt <task-name>`, e.g. `$ grunt test`
