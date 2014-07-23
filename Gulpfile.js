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


gulp.task('test-phantom',function () {
    return gulp.src(['./dist/test.html'])
        .pipe($.mochaPhantomjs());
});

gulp.task('build', function() {
    
    return browserify('./lib/requesty.js')
        .bundle({
            insertGlobals: false
        })
        .pipe(source('requesty.min.js'))
        .pipe($.streamify($.uglify()))
        .pipe(gulp.dest('website/dist'));
});


gulp.task('build-test', function() {
    
    return browserify('./test/all_test.js')
        .bundle({
            insertGlobals: false
        })
        .pipe(source('requesty-test.js'))

        .pipe(gulp.dest('website/dist'));
});

gulp.task('watch', function() {
    gulp.watch([lib, test], ['test']);
});

gulp.task('default', ['test', 'watch']);
