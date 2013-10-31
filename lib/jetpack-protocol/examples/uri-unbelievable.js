/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true browser: true
         forin: true latedef: false globalstrict: true */
/*global define: true */

'use strict';

const protocol = require('../index')

// Directory of this module.
var root = module.id.substr(0, module.id.lastIndexOf('/') + 1)

// Ok, this is just insane, but gives you perspective!
var SEPARATOR = '|'
exports.handler = protocol.protocol('jedi', {
  isAbsolute: function(uri) {
    return 0 === uri.indexOf('jedi:')
  },
  onResolve: function(relative, base) {
    var path, paths, last
    if (this.isAbsolute(relative)) return relative
    paths = relative.split(SEPARATOR)
    base = base ? base.split(SEPARATOR) : [ '.' ]
    if (base.length > 1) base.pop()
    while ((path = paths.shift())) {
      if (path === '..') {
        if (base.length && base[base.length - 1] !== '..') {
          if (base.pop() === '.') base.push(path)
        } else base.push(path)
      } else if (path !== '.') {
        base.push(path)
      }
    }
    if (base[base.length - 1].substr(-1) === '.') base.push('')
    return base.join(SEPARATOR)
  },
  onRequest: function(request, response) {
    console.log('>>>', JSON.stringify(request, '', '  '))
    response.uri = root + request.uri.replace('jedi:', '').replace(SEPARATOR, '/')
    console.log('<<<', JSON.stringify(response, '', '  '))
  }
})

exports.handler.register()      // start listening
// exports.handler.unregister() // stop listening

require('tabs').open('jedi:data|about.html')
