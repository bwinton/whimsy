/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false globalstrict: true */
/*global define: true */

'use strict';

const protocol = require('../index')

// var self = require('self') // Simulator
var self = new function Self() {
  const root = module.id.substr(0, module.id.lastIndexOf('/')) + '/data/'
  this.data = {
    url: function(path) {
      return root + path
    }
  }
}

exports.handler = protocol.protocol('content', {
  onRequest: function(request, response) {
    console.log('>>>', JSON.stringify(request, '', '  '))
    // redirect to local content
    response.uri = self.data.url(request.uri.replace('content://', ''))
    console.log('<<<', JSON.stringify(response, '', '  '))
  }
})

exports.handler.register()      // start listening
// exports.handler.unregister() // stop listening

require('tabs').open('content:///about.html')
