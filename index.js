var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-css-adjust-path';

function handleStream() {
    var stream = through();

    return stream;
}

// Plugin level function(dealing with files)
function gulpCssAdjustPath(needle) {
    var pathArray,
        replacement;

    if (!needle) {
        throw new PluginError(PLUGIN_NAME, 'Missing search value!');
    }

    if (!needle instanceof RegExp) {
        throw new PluginError(PLUGIN_NAME, 'Search value must be a regex containing two capturing groups!');
    }

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        //windows uses backward slash in file path
        var isWin = process.platform === "win32";
        var separator = isWin ? '\\' : '/';
        
        pathArray = file.path.substring(file.base.length).split(separator);
        replacement = '$1' + '../' + Array(pathArray.length).join('../') + '$2';

        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        if (!pathArray.length) {
            // replace absolute path with: look on same level
            replacement = '$1./$2';
        }

        if (file.isStream()) {
            file.contents = file.contents.pipe(replace(needle, replacement));
        } else if (file.isBuffer()) {
            file.contents = new Buffer(String(file.contents).replace(needle, replacement));
        }

        return cb(null, file);
    });
}

// Exporting the plugin main function
module.exports = gulpCssAdjustPath;
