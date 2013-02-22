#!/usr/bin/env node

/** read coverage json from stdin, push report html to stdout.
 *
 */

var id = require('./package.json').id;

var HTMLReporter = require('./node_modules/coverjs-moz/lib/reporters/HTMLReporter');
//var reporter = new HTMLReporter(global.__$coverObject);

var buffer = ''; 
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) { buffer += chunk; }); 
process.stdin.on('end', function () {
    var reporter = new HTMLReporter(JSON.parse(buffer));
    console.log(reporter.report());
    reporter.report()
}).resume();
