/* jshint esversion:6 */

"use strict";

const
	SOURCE_PATH = "./source",
	DIST_PATH = "./dist",
	JS_SOURCE_PATH = SOURCE_PATH + "/js",
	JS_DIST_PATH = DIST_PATH + "/js",
	HBS_SOURCE_PATH = SOURCE_PATH + "/handlebars",
	HBS_DIST_PATH = "./source/temp/templates",
	LESS_SOURCE_PATH = SOURCE_PATH + "/less",
	LESS_DIST_PATH = DIST_PATH + "/css",
	IMG_SOURCE_PATH = SOURCE_PATH + "/img",
	IMG_DIST_PATH = DIST_PATH + "/img";

const gulp = require("gulp"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	gutil = require("gulp-util"),
	clean = require("gulp-clean"),
	jshint = require("gulp-jshint"),
	jscs = require("gulp-jscs"),
	connect = require("gulp-connect"),
	handlebars = require("gulp-handlebars"),
	defineModule = require("gulp-define-module"),
	less = require("gulp-less"),
	path = require("path"),
	imagemin = require("gulp-imagemin"),
	uglify = require("gulp-uglify"),
	cleanCSS = require("gulp-clean-css");

gulp.task("imagemin", ["img:clean"], function () {
	return gulp.src(IMG_SOURCE_PATH + "/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest(IMG_DIST_PATH));
});

gulp.task("less", function () {
	return gulp.src(LESS_SOURCE_PATH + "/*.less")
		.pipe(less({
			paths: [ path.join(__dirname) ]
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(LESS_DIST_PATH));
});

gulp.task("hbs:templates", function(){
	gulp.src([HBS_SOURCE_PATH + "/*.hbs"])
		.pipe(handlebars())
		.pipe(defineModule("node"))
		.pipe(gulp.dest(HBS_DIST_PATH + "/"));
});

gulp.task("js:clean", function () {
	return gulp.src(JS_DIST_PATH, {read: false})
		.pipe(clean({force: true}));
});

gulp.task("img:clean", function () {
	return gulp.src(IMG_DIST_PATH, {read: false})
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

gulp.task("js:browserify", ["js:jshint", "js:jscs", "hbs:templates", "js:clean"], function () {
	var b = browserify({
		debug: false,
		basedir: JS_SOURCE_PATH + "/",
		paths: ["../js/", "../temp/"],
		entries: "main.js"
	});

	return b.bundle()
		.on("error", gutil.log)
		.pipe(source("main.js"))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(JS_DIST_PATH + "/"));
});

gulp.task("html:copy", function() {
	return gulp.src(SOURCE_PATH + "/index.html")
		.pipe(gulp.dest(DIST_PATH + "/"));
});

gulp.task("connect", function() {
	connect.server({
		host: "localhost",
		port: 8000,
		root: DIST_PATH
	});
});

gulp.task("watch", ["js:browserify", "html:copy", "less", "imagemin"], function () {
	gulp.watch(JS_SOURCE_PATH + "/**/*.js", ["js:browserify"]);
	gulp.watch(SOURCE_PATH + "/index.html", ["html:copy"]);
	gulp.watch(LESS_SOURCE_PATH + "/**/*.less", ["less"]);
	gulp.watch(IMG_SOURCE_PATH + "/**/*.{gif|png|jpg}", ["imagemin"]);
});

gulp.task("default", ["connect", "watch"], function () {});
