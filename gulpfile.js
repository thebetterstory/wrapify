/************************************************************************************************************************************
 1. Variables
 ************************************************************************************************************************************/
var gulp = require('gulp'); // Main gulp module
var sass = require('gulp-sass'); // Gulp libsass
var sourcemaps = require('gulp-sourcemaps'); // SASS sourcemaps
var prefix = require('gulp-autoprefixer'); // CSS autoprefixer
var rename = require('gulp-rename'); // Rename files
var concat = require('gulp-concat'); // Javascript concatination
var uglify = require('gulp-uglify'); // Javascript minification
var cleanCSS = require('gulp-clean-css'); // CSS Minify
var notify = require('gulp-notify'); // Notifications
var filter = require('gulp-filter'); // Filter
var flatten = require('gulp-flatten'); // Filter
var plumber = require('gulp-plumber'); // Continue on error
var jscs = require('gulp-jscs'); // Javascript code style
var config = {
	bootstrapDir: './node_modules/bootstrap'
};

/************************************************************************************************************************************
 2. Default Task
 ************************************************************************************************************************************/
gulp.task(
	'default',
	['sass', 'javascript-vendor', 'javascript'],
	function() {}
);

/************************************************************************************************************************************
 3. Watch
 ************************************************************************************************************************************/
gulp.task('watch', function() {
	// Watch .scss files
	gulp.watch(['.assets/sass/**/*.scss'], ['sass']);

	// Watch .js files
	gulp.watch(
		['.assets/js/**/*.js', '!.assets/js/vendor/**/*.js'],
		['javascript']
	);

	gulp.watch(['.assets/js/vendor/**/*.js'], ['javascript-vendor']);
});

/************************************************************************************************************************************
 4. SASS
 ************************************************************************************************************************************/
gulp.task('sass', function() {
	gulp
		.src(['.assets/sass/**/*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(
			sass({
				style: 'compressed',
				includePaths: [config.bootstrapDir + '/scss']
				//,'sourcemap=none': true
			})
		)
		.pipe(plumber())
		.pipe(prefix('last 3 version', '> 5%', 'ie 8', 'ie 7'))
		.pipe(cleanCSS({ compatibility: 'ie9' }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(plumber())
		.pipe(sourcemaps.write('./sourcemaps'))
		.pipe(gulp.dest('css/'));
});

/************************************************************************************************************************************
 5. Javascript
 ************************************************************************************************************************************/
gulp.task('javascript', function() {
	return gulp
		.src(['.assets/js/**/*.js', '!.assets/js/vendor/**/*.js'])
		.pipe(concat('/main.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('js'));
	//        .pipe(notify({ message: 'Javascript "General" finished' }));
});

gulp.task('javascript-vendor', function() {
	return gulp
		.src(['js/vendor/**/*.js', config.bootstrapDir + '/dist/js/bootstrap.js'])
		.pipe(concat('/vendors.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(plumber())
		.pipe(uglify())
		.pipe(plumber())
		.pipe(gulp.dest('js/vendor/'));
});
