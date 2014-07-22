/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var gutil = require('gulp-util');

var $ = loadPlugins({
    lazy: true
});

var test = './test/**/*.js';
var lib = './lib/**/*.js';

gulp.task('test', function() {
    return gulp.src([test])
        .pipe($.mocha({
            ui: 'bdd',
            reporter: 'spec'
        })).on('error', function(err){
            gutil.log(err.message);
        });
});

gulp.task('build', function() {
    
    return browserify('./lib/requesty.js')
        .bundle({
            insertGlobals: false
        })
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch([lib, test], ['test']);
});

gulp.task('default', ['test', 'watch']);
