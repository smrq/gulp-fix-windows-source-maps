// Generated by CoffeeScript 1.7.1
(function() {
  var PluginError, buffer, convert, es, gutil;

  buffer = require('buffer');

  convert = require('convert-source-map');

  es = require('event-stream');

  gutil = require('gulp-util');

  PluginError = gutil.PluginError;

  module.exports = function(opt) {
    var modifyFile;
    modifyFile = function(file) {
      var contents, i, sourceMap, sources, _i, _ref;
      if (file.isNull()) {
        return this.emit('data', file);
      }
      if (file.isStream()) {
        return this.emit('error', new PluginError('gulp-fix-windows-source-maps', 'Streaming not supported'));
      }
      contents = file.contents.toString('utf8');
      sourceMap = convert.fromSource(contents);
      sources = sourceMap.getProperty("sources");
      for (i = _i = 0, _ref = sources.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        sources[i] = sources[i].replace(new RegExp("\\\\", "g"), "/");
      }
      sourceMap.setProperty("sources", sources);
      contents = contents.replace(convert.commentRegex, sourceMap.toComment());
      file.contents = buffer.Buffer(contents);
      return this.emit('data', file);
    };
    return es.through(modifyFile);
  };

}).call(this);
