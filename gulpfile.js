var gulp = require('gulp'),
	browserSync = require('browser-sync'),
    reload = browserSync.reload,
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence');

// Minify Images
gulp.task('images', function() {
  return gulp.src('./img/**/*')
    .pipe($.changed('./dist/img'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/img/'));
});

// Sync browser
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

// Minify JS
gulp.task('minify-js',function(){
	return gulp.src(['js/app.js','js/routes.js','js/services','js/controllers/*.js','./js/**/*.js'])
	.pipe($.debug({title: 'Minify:'}))
	.pipe($.concat('main.min.js'))
	.pipe($.uglify())
	.pipe(gulp.dest('./dist/js'))
});




gulp.task('minify-html', function() {
  var opts = {
    comments: true,
    spare: false,
    conditionals: false
  };

  gulp.src('./*.html')
   .pipe($.htmlReplace({
        'css': 'css/style.min.css',
        'js': 'js/main.min.js'
    }))
    .pipe($.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true,removeComments:true}))
    .pipe(gulp.dest('./dist'));
     gulp.src('./pages/*.html')
     .pipe($.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true,removeComments:true}))
     .pipe(gulp.dest('./dist/pages/'));
});

// start webserver
gulp.task('server', function(done) {
  return browserSync({
    server: {
      baseDir: './'
    }
  }, done);
});

// start webserver from _build folder to check how it will look in production
gulp.task('server-build', function(done) {
  return browserSync({
    server: {
      baseDir: './dist/'
    }
  }, done);
});

// delete build folder
gulp.task('clean:build', function (cb) {
  del([
    './dist/'
  ], cb);
});

//SASS
gulp.task('sass', function() {
  return gulp.src('css/*.scss')
    .pipe($.sass({
      style: 'expanded'
    }))
    .on('error', $.notify.onError({
      title: 'SASS Failed',
      message: 'Error(s) occurred during compile!'
    }))
    .pipe(gulp.dest('css'))
    .pipe(reload({
      stream: true
    }))
    .pipe($.notify({
      message: 'Styles task complete'
    }));
});
require('events').EventEmitter.prototype._maxListeners = 100;

// CSS Build task
gulp.task('css:build', function() {
  var s = $.size();

  return gulp.src(['./css/**/*.css','!./css/**/*.min.css','!./css/vendor/*.css'])
    .pipe($.debug({title: 'SCSS:'}))
    .pipe($.autoprefixer('last 3 version'))
    .pipe($.debug({title: 'PREFIX:'}))
    //TODO EXCLUDE important classes from build clearing
    .pipe($.uncss({
      html: ['./*.html', './pages/*.html']

      
    }))
    .pipe($.debug({title: 'UNCSS:'}))
    .pipe($.cleanCss({
      keepBreaks: false,
      aggressiveMerging: false,
      advanced: false
    }))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./css/'))
    .pipe($.concat('style.min.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total CSS size ' + s.prettySize;
      }
    }));
});


//reload browser
gulp.task('bs-reload', function() {
  browserSync.reload();
});

// calculate build folder size
gulp.task('build:size', function() {
  var s = $.size();

  return gulp.src('./_build/**/*.*')
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total build size ' + s.prettySize;
      }
    }));
});

//defaults

gulp.task('default', ['browser-sync', 'sass', 'css:build'], function() {
  gulp.watch('css/*.css', function(file) {
    if (file.type === "changed") {
      reload(file.path);
    }
  });
  gulp.watch(['*.html', 'pages/*.html'], ['bs-reload']);
  gulp.watch(['js/*.js'], ['bs-reload']);
  gulp.watch('css/**/*.scss', ['sass', 'css:build']);
});

//Copy everything
gulp.task('copy', function() {
  gulp.src(['./*.png','./*.xml','./*.ico','./*.txt'])
  .pipe(gulp.dest('./dist'));
 gulp.src(['./assets/*'])
  .pipe(gulp.dest('./dist/assets/'));
  gulp.src(['./css/vendor/**/*','!./css/vendor/**/*.min.css'])
  .pipe(gulp.dest('./dist/css/vendor/'));
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:build',
    'sass',
    'css:build',
    'images',
    'minify-js',
    'minify-html',
    'copy',
    'build:size',
    callback);
});