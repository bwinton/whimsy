# Whimsy
> An addon to add some whimsperiments to your Firefox…

## Prerequisites

- [Mozilla Firefox, version 43 or later](https://www.mozilla.org/en-US/firefox/nightly/)
- [`node` and `npm`](https://nodejs.org/)
- [`gulp`](http://gulpjs.com/): `$ npm install -g gulp`

## Up and Running

0. Install the prereqs (see above)
1. Fork and clone this repository
2. Install the required npm modules using: `$ npm install`
3. Build the add-on using: `$ gulp`
4. Install the add-on by dragging `dist/whimsy.xpi` onto your Firefox Nightly.

## Scripts

Whimsy uses the `gulp` task runner to build the add-on:
It puts the resulting files in the `dist` directory, and bundles them into a Firefox add-on located at `dist/whimsy.xpi`.
