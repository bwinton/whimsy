/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

(function () {
  var TRANSITION_DURATION = 500;
  var PACKAGE_URL = 'https://api.github.com/repos/bwinton/whimsy/contents/package.json';

  var percent = d3.format('0.1%');

  var getSubItems = function (item) {
    var elem = d3.select(this);
    console.log(elem, item);
    elem.append('div').classed('title', true)
      .text(`${item.title}:`);
    elem.attr('title', `${item.description}`);

    if (item.type === 'bool') {
      elem.selectAll('.value').data(['true', 'false'])
        .enter().append('div').classed('value', true)
        .text(value => value)
    } else if (item.type === 'menulist') {
      elem.selectAll('.value').data(item.options)
        .enter().append('div').classed('value', true)
        .text(option => option.label)
    } else if (item.type === 'string') {
      elem.selectAll('.value').data(['default', 'modified'])
        .enter().append('div').classed('value', true)
        .text(value => value)
    } else {
    }
  }

  var draw = function (prefs) {
    d3.select('.prefs').select('.loading')
      .transition().duration(TRANSITION_DURATION)
      .style({'opacity': '0'})
      .remove();

    var items = d3.select('.prefs').selectAll('.item').data(prefs);

    items.enter().append('div').classed('item', true)
      .each(getSubItems);

    items.transition().duration(TRANSITION_DURATION)
      .delay((d, i) => TRANSITION_DURATION + i*20)
      .style({'opacity': '1'});
  };

  $.when(d3.jsonPromise(PACKAGE_URL, true))
    .then(function (pkg) {
      var prefs = new Map(pkg.preferences.map(v => [v.name, v]));
      console.log(prefs);
      draw(pkg.preferences);
    }).fail(function (error) {
      console.log('Fail', error);
    });
})();
