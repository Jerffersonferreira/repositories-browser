/* jshint esversion:6 */

"use strict";

const
	JS_SOURCE_PATH = "./source/js",
	JS_DIST_PATH = "./dist/js";

const gulp = require("gulp"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	uglify = require("gulp-uglify"),
	sourcemaps = require("gulp-sourcemaps"),
	gutil = require("gulp-util"),
	clean = require("gulp-clean"),
	jshint = require("gulp-jshint"),
	jscs = require("gulp-jscs");

gulp.task("js:clean", function () {
	return gulp.src(JS_DIST_PATH, {read: false})
		.pipe(clean({force: true}));
});

gulp.task("js:jscs", () => {
	return gulp.src(JS_SOURCE_PATH + "/**/*.js")
		.pipe(jscs())
		.pipe(jscs.reporter());
});

gulp.task("js:jshint", function() {
	return gulp.src(JS_SOURCE_PATH + "/**/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jshint.reporter("jshint-stylish"))
		.pipe(jshint.reporter("fail"));
});

gulp.task("js:browserify", ["js:jshint", "js:jscs", "js:clean"], function () {
	var b = browserify({
		debug: true,
		basedir: JS_SOURCE_PATH + "/",
		paths: [JS_SOURCE_PATH + "/"]
	});

	return b.bundle()
		.pipe(source("main.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.on("error", gutil.log)
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(JS_DIST_PATH + "/"));
});

gulp.task("watch", function () {
	gulp.watch(JS_SOURCE_PATH + "/**/*.js", ["js:browserify"]);
});
