/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

var test = './test/**/requesty_test.js';
var lib = './lib/**/*.js';

gulp.task('test', function() {
    return gulp.src([test])
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'spec'
        }));
});

gulp.task('watch', function() {
    gulp.watch([lib, test], ['test']);
});

gulp.task('default', ['test', 'watch']);
