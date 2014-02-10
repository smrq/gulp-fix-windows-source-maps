buffer = require 'buffer'
convert = require 'convert-source-map'
es = require 'event-stream'
gutil = require 'gulp-util'

PluginError = gutil.PluginError

module.exports = (opt) ->
	modifyFile = (file) ->
		if file.isNull()
			return @emit 'data', file
		if file.isStream()
			return @emit 'error', new PluginError 'gulp-fix-windows-source-maps', 'Streaming not supported'

		contents = file.contents.toString 'utf8'
		sourceMap = convert.fromSource contents
		sources = sourceMap.getProperty "sources"
		for i in [0...sources.length]
			sources[i] = sources[i].replace new RegExp("\\\\","g"), "/"
		sourceMap.setProperty "sources", sources
		contents = contents.replace convert.commentRegex, sourceMap.toComment()
		file.contents = buffer.Buffer contents
		@emit 'data', file

	es.through modifyFile