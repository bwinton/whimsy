module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  /* Build and deploy tasks. */

  grunt.registerTask('build', 'Build the add-on', function() {
    var done = this.async();
    grunt.util.spawn({
      cmd: 'cfx',
      args: ['xpi',
        '--update-link',
        'https://people.mozilla.com/~bwinton/whimsy/whimsy.xpi',
        '--update-url',
        'https://people.mozilla.com/~bwinton/whimsy/whimsy.update.rdf'
      ]
    }, function spawned(error, result, code) {
      grunt.log.ok(result);
      grunt.log.ok('Add-on built.');
      done();
    });
  });

  grunt.registerTask('amo', 'Build the add-on for AMO', function() {
    var done = this.async();
    grunt.util.spawn({
      cmd: 'cfx',
      args: ['xpi']
    }, function spawned(error, result, code) {
      grunt.log.ok(result);
      grunt.log.ok('Add-on built.');
      done();
    });
  });


  grunt.registerTask('copy', 'Copy the files to the server.', function() {
    this.requires(['build']);

    if (!grunt.file.exists('/Volumes/People/public_html/whimsy')) {
      grunt.log.error('Missing Directory!');
      done(false);
      return;
    }

    grunt.file.copy('whimsy.xpi',
                    '/Volumes/People/public_html/whimsy/whimsy.xpi',
                    {'encoding': null});
    grunt.log.ok('Copied XPI…');
    grunt.file.copy('whimsy.update.rdf',
                    '/Volumes/People/public_html/whimsy/whimsy.update.rdf',
                    {'encoding': null});
    grunt.log.ok('Copied update.rdf…');
    grunt.file.copy('index.html',
                    '/Volumes/People/public_html/whimsy/index.html',
                    {'encoding': null});
    grunt.log.ok('Copied index.html…');
    grunt.file.copy('wheeeeee.png',
                    '/Volumes/People/public_html/whimsy/wheeeeee.png',
                    {'encoding': null});
    grunt.log.ok('Copied wheeeeee.png…');
  });

  grunt.registerTask('deploy', 'Build the add-on and copy the files.', ['build', 'copy']);


  /* Testing tasks. */

  grunt.registerTask('run', 'Run a testing version of the add-on', function() {
    var done = this.async();
    var run = grunt.util.spawn({
      cmd: 'cfx',
      args: ['run',
        '-b',
        '/Applications/Local/Firefox.app',
        '-p',
        'profile.testing'
      ]
    }, function spawned(error, result, code) {
      if (code != 0) {
        console.log(error);
      }
      done();
    });
    if (run.stderr) {
      run.stderr.on('data', function (buf) {
        grunt.log.ok(buf);
      })
    }
  });

  grunt.registerTask('fennec', 'Run a testing version of the add-on on Android', function() {
    var done = this.async();
    var run = grunt.util.spawn({
      cmd: 'cfx',
      args: ['run',
        '-a',
        'fennec-on-device',
        '-b',
        '/usr/local/bin/adb',
        '--mobile-app',
        'fennec',
        '--force-mobile'
      ]
    }, function spawned(error, result, code) {
      if (code != 0) {
        console.log(error);
      }
      done();
    });
    if (run.stderr) {
      run.stderr.on('data', function (buf) {
        grunt.log.ok(buf);
      })
    }
  });

  grunt.registerTask('test', 'Run the tests for the add-on', function() {
    var done = this.async();
    var run = grunt.util.spawn({
      cmd: 'cfx',
      args: ['test',
        '-b',
        '/Applications/Local/Firefox.app'
      ]
    }, function spawned(error, result, code) {
      done();
    });
    if (run.stderr) {
      run.stderr.on('data', function (buf) {
        grunt.log.ok(buf);
      })
    }
  });


};
