'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var raml = require('gulp-raml');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var size = require('gulp-size');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nodemon = require('gulp-nodemon');

var path = require('path');
var raml2html = require('raml2html');
var through = require('through2');
var yaml = require('js-yaml');
var map = require('map-stream');

var srcFiles = [
    'src/**/*.js',
    'index.js',
    'gulpfile.js',
    'test/**/*.js'
];

function handleError(err) {
    console.error(err.toString());
    process.exit(1);
}

function exitOnError(type) {
    return map(function(file, callback) {
        if (!file[type].success) {
            process.exit(1);
        }

        callback(null, file);
    });
}

function generateDoc(options) {
    var simplifyMark = function(mark) {
        if (mark) {
            mark.buffer = mark.buffer
                .split('\n', mark.line + 1)[mark.line]
                .trim();
        }
    };

    if (!options) {
        options = {};
    }

    switch (options.type) {
        case 'json':
            options.config = {
                template: function(obj) {
                    return JSON.stringify(obj, null, 2);
                }
            };
            break;
        case 'yaml':
            options.config = {
                template: function(obj) {
                    return yaml.safeDump(obj, {
                        skipInvalid: true
                    });
                }
            };
            break;
        default:
            options.type = 'html';
            if (!options.config) {
                options.config = raml2html.getDefaultConfig(
                    options.https,
                    options.template,
                    options.resourceTemplate,
                    options.itemTemplate
                );
            }
    }

    if (!options.extension) {
        options.extension = '.' + options.type;
    }

    var stream = through.obj(function(file, enc, done) {
        var fail = function(message) {
            done(new gutil.PluginError('raml2html', message));
        };

        if (file.isBuffer()) {
            var cwd = process.cwd();
            process.chdir(path.resolve(path.dirname(file.path)));
            raml2html
                .render(file.contents, options.config)
                .then(function(output) {
                        process.chdir(cwd);
                        stream.push(new gutil.File({
                            base: file.base,
                            cwd: file.cwd,
                            path: gutil.replaceExtension(
                                file.path, options.extension),
                            contents: new Buffer(output)
                        }));
                        done();
                    },
                    function(error) {
                        process.chdir(cwd);
                        simplifyMark(error.context_mark);
                        simplifyMark(error.problem_mark);
                        process.nextTick(function() {
                            fail(JSON.stringify(error, null, 2));
                        });
                    }
                );
        }
        else if (file.isStream()) {
            fail('Streams are not supported: ' + file.inspect());
        }
        else if (file.isNull()) {
            fail('Input file is null: ' + file.inspect());
        }
    });

    return stream;
}

gulp.task('raml', function() {
    gulp.src('specs/*.raml')
        .pipe(raml())
        .pipe(raml.reporter('default'))
        .pipe(exitOnError('raml'));
});

gulp.task('doc', function() {
    return gulp.src('specs/*.raml')
        .pipe(generateDoc())
        .on('error', handleError)
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('doc/build'));
});

gulp.task('pre-test', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
    return gulp.src('test/**/*.spec.js', { read: false })
        .pipe(mocha({
            require: ['./test/common.js'],
            reporter: 'spec',
            ui: 'bdd',
            recursive: true,
            colors: true,
            timeout: 60000,
            slow: 300,
            delay: true
        }))
        .pipe(istanbul.writeReports())
        .once('error', function() {
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
});

gulp.task('lint', function() {
    return gulp.src(srcFiles)
        .pipe(jshint())
        .pipe(jscs())
        .pipe(stylish.combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(size())
        .pipe(exitOnError('jshint'));
});

gulp.task('check', ['raml', 'lint', 'test']);

gulp.task('develop', function() {
    return nodemon({
        script: 'index.js',
        ext: 'js',
        tasks: ['lint']
    });
});
