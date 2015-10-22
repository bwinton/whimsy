# UI-Playground
> An addon to test some UI in WebExtensions.

Get it [here](https://dl.dropboxusercontent.com/u/2301433/Firefox/WebExtensions/ui-playground.xpi)!

## Prerequisites

- [Mozilla Firefox, version 44 or later](https://www.mozilla.org/en-US/firefox/nightly/)
- [`node` and `npm`](https://nodejs.org/)
- [`gulp`](http://gulpjs.com/): `$ npm install -g gulp`

## Up and Running

0. Install the prereqs (see above)
1. Fork and clone this repository
2. Install the required npm modules using: `$ npm install`
3. Build the add-on using: `$ gulp`
4. Install the add-on by dragging `dist/ui-playground.xpi` onto your Firefox Nightly.

## Scripts

UI-Playground uses the `gulp` task runner to build the add-on:
It puts the resulting files in the `dist` directory, and bundles them into a Firefox add-on located at `dist/ui-playground.xpi`.
