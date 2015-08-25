var assert = require('stream-assert');
var gulp = require('gulp');
var File = gulp.File;
var plugin = require('../');
var path = require('path');
var should = require('should');

var fixtures = function (glob) {
  return path.join(__dirname, 'fixtures', glob);
}

describe('gulp-config-sync', function() {
  describe('plugin', function() {

    it('should emit error on streamed file', function(done) {
      gulp.src(
        path.join(__dirname, 'fixtures', 'config.json'),
        { buffer: false }
      )
        .pipe(plugin())
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });

    it('should emit error when source.json not found', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config.json'))
        .pipe(plugin({ src: 'i-dont-exist.json', }))
        .on('error', function (err) {
          done();
        });
    });

    it('should emit error when config is not a valid JSON', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config-invalid.json'))
        .pipe(plugin({ src: 'test/fixtures/source.json', }))
        .on('error', function (err) {
          err.message.should.eql('Invalid config file: Not a valid JSON');
          done();
        });
    });

    it('should sync config file', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config.json'))
        .pipe(plugin({ src: 'test/fixtures/source.json', }))
        .pipe(assert.first(function (d) {
          var config = JSON.parse(d.contents.toString());
          config.should.have.property('name', 'name1');
          config.should.have.property('description', 'description1');
          config.should.have.property('version', 'version1');
          config.should.have.property('keywords').with.lengthOf(2);
          config.keywords[0].should.equal('keyword1');
          config.keywords[1].should.equal('keyword2');
          config.should.have.property('repository');
          config.repository.should.have.property('type', 'git');
          config.repository.should.have.property('url', 'git://github.com/foo/bar.git');


        }))
        .pipe(assert.end(done));
    });

    it('should sync empty config file', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config-empty.json'))
        .pipe(plugin({ src: 'test/fixtures/source.json', }))
        .pipe(assert.first(function (d) {
          var config = JSON.parse(d.contents.toString());
          config.should.have.property('name', 'name1');
          config.should.have.property('description', 'description1');
          config.should.have.property('version', 'version1');
          config.should.have.property('keywords').with.lengthOf(2);
          config.keywords[0].should.equal('keyword1');
          config.keywords[1].should.equal('keyword2');

        }))
        .pipe(assert.end(done));
    });

    it('should sync empty source field', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config-empty.json'))
        .pipe(plugin({ src: 'test/fixtures/source-min.json', }))
        .pipe(assert.first(function (d) {
          var config = JSON.parse(d.contents.toString());
          config.should.have.property('name', 'name1');
          config.should.have.property('version', 'version1');

          config.should.not.have.property('description', '');
          config.should.not.have.property('keywords', '');

        }))
        .pipe(assert.end(done));
    });

    it('should sync custom fields', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config-empty.json'))
        .pipe(plugin({
          src: 'test/fixtures/source.json',
          fields: [
            {
              from: 'contributors',
              to: 'authors',
            },
          ],
        }))
        .pipe(assert.first(function (d) {
          var config = JSON.parse(d.contents.toString());
          config.should.have.property('authors', ['author2', 'author3']);
        }))
        .pipe(assert.end(done));
    });

    it('should not sync unwanted fields', function(done) {
      gulp.src(path.join(__dirname, 'fixtures', 'config-empty.json'))
        .pipe(plugin({
          src: 'test/fixtures/source.json',
          fields: ['name', 'version'],
        }))
        .pipe(assert.first(function (d) {
          var config = JSON.parse(d.contents.toString());
          config.should.not.have.property('license');
          config.should.not.have.property('repository');
        }))
        .pipe(assert.end(done));
    });

  });
});
