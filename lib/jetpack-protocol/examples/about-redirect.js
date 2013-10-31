/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false globalstrict: true */
/*global define: true */

'use strict';

const protocol = require('../index')

exports.handler = protocol.about('downloads', {
  onRequest: function(request, response) {
    console.log('>>>', JSON.stringify(request, '', '  '))
    // Just redirect to something else.
    response.uri = 'chrome://mozapps/content/downloads/downloads.xul'
    console.log('<<<', JSON.stringify(response, '', '  '))
  }
})

exports.handler.register()      // start listening
// exports.handler.unregister() // stop listening

require('tabs').open('about:downloads')
