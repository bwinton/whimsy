/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

(function () {
  var TRANSITION_DURATION = 500;
  var PACKAGE_URL = 'https://raw.githubusercontent.com/bwinton/whimsy/master/package.json';

  var percent = d3.format('0.1%');

  var sortFunc = function (a, b) {
    var aStatus = a.qx_status;
    var bStatus = b.qx_status;

    if (!aStatus) {
      if (!bStatus) {
        return a.id - b.id
      }
      return -1;
    }
    if (!bStatus) {
      return 1;
    }

    aStatus = orderedStatuses.get(aStatus) || 0;
    bStatus = orderedStatuses.get(bStatus) || 0;
    if (aStatus != bStatus) {
      return aStatus - bStatus;
    }

    return a.id - b.id
  }

  var getColour = function (status) {
    switch (status) {
      case 'not_ready':
        return 'rgb(255,255,255)';
      case 'submitted':
        return 'rgb(127,255,127)';
      case 'assigned':
      case 'fixed':
        return 'rgb(192,214,255)';
      default:
        return 'rgb(255,127,127)';
    }
  };

  var getAssignee = function (bug) {
    if (bug.assigned_to) {
      return bug.assigned_to;
    }
    return 'nobody';
  }

  var getMentor = function (bug) {
    if (bug.mentors && bug.mentors.length) {
      return bug.mentors.join(', ');
    }
    return false;
  }

  var getDxr = function (bug) {
    if (bug.dxr && bug.dxr !== 'no') {
      return 'has link';
    }
    return false;
  }

  var getSpec = function (bug) {
    if (bug.spec && bug.spec !== 'no') {
      return 'has spec';
    }
    return false;
  }

  var summarize = function (bugs) {

    var summary = [
      {name: ['unknown'], bugs: []},
      {name: ['not_ready'], bugs: []},
      {name: ['submitted'], bugs: []},
      {name: ['assigned', 'fixed'], bugs: []},
    ];
    bugs.forEach(bug => {
      var status = orderedStatuses.get(bug.qx_status) || 0;
      // Lump fixed in with assigned.
      if (status === 4) {
        status = 3;
      }
      summary[status].bugs.push(bug);
      summary[status].percentage = summary[status].bugs.length / bugs.length;
    });
    return summary.filter(category => category.bugs.length);
  }

  var draw = function (bugs) {
    d3.select('.bugs').select('.loading').remove()

    var bugRow = d3.select('.bugs').selectAll('.bug')
      .data(bugs.sort(sortFunc));

    bugRow.enter().append('div').classed('bug', true)
      .classed('fixed', bug => bug.qx_status === 'fixed')
      .style({'opacity': '0', 'background-color': bug => getColour(bug.qx_status)})
      .attr('title', bug => bug.qx_status);

    bugRow.append('span').classed('icon glyphicon glyphicon-user', true)
      .classed('missing', bug => !getMentor(bug))
      .attr('title', bug => getMentor(bug) || 'nobody');
    bugRow.append('span').classed('icon glyphicon glyphicon-search', true)
      .classed('missing', bug => !getDxr(bug))
      .attr('title', bug => getDxr(bug) || 'missing link');
    bugRow.append('span').classed('icon glyphicon glyphicon-picture', true)
      .classed('missing', bug => !getSpec(bug))
      .attr('title', bug => getSpec(bug) || 'missing spec');

    bugRow.append('a').text(bug => bug.id).classed('bugid', true)
      .attr('href', bug => 'https://bugzilla.mozilla.org/show_bug.cgi?id=' + bug.id);
    bugRow.append('span').classed('summary', true)
      .text(bug => bug.summary + ' (' + getAssignee(bug) + ')');
    bugRow.append('a').classed('twitter', true)
      .attr('href', bug => bug.twitter)
      .classed('missing', bug => !bug.twitter);

    bugRow.transition().duration(TRANSITION_DURATION)
      .delay((d, i) => i*20)
      .style({'opacity': '1'});

    bugRow.exit()
      .transition().duration(TRANSITION_DURATION)
      .style({'height': '0px', 'opacity': '0'})
      .remove();

    var category = d3.select('.summaries').selectAll('.category')
      .data(summarize(bugs));

    category.enter().append('div').classed('category', true)
      .style({
        'flex': category => category.bugs.length,
        'background-color': category => getColour(category.name[0])
      });
    category.selectAll('.name').data(category => category.name)
      .enter().append('span').classed('name', true)
      .text(name => name).classed('fixed', name => name === 'fixed');
    category.append('span').text(category => ': ' + category.bugs.length);
    category.append('span').text(category => ' (' + percent(category.percentage) + ')');
  };

  $.when(d3.jsonPromise(PACKAGE_URL))
    .then(function (pkg) {
      var preferences = new Map(pkg.preferences.map(v => [v.name, v]));
      console.log(preferences);
    }).fail(function (error) {
      console.log('Fail', error);
    });
})();
