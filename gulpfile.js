const gulp = require('gulp');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const babelify = require('babelify');
const browserify = require('browserify');
const plugins = require('gulp-load-plugins')();


const bundler = watchify(browserify('./public/javascripts/index.js', watchify.args)
  .transform(babelify));
bundler.on('update', bundle);
bundler.on('log', plugins.util.log);


function bundle() {
  return bundler.bundle()
    // log errors
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('index.js'))
    // build sourcemaps
    .pipe(require('vinyl-buffer')())
    .pipe(plugins.sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/dest'));
}


gulp.task('scss:lint', () => {
  gulp.src('./public/scss/**/*.scss')
    .pipe(plugins.scssLint());
});


gulp.task('scss:compileDev', () => {
  gulp.src('./public/scss/**/*.scss')
    // Build sourcemaps
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});


gulp.task('scss:compile', ['fonts:copy'], () => {
  gulp.src('./public/scss/**/*.scss')
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(gulp.dest('./public/css'));
});


gulp.task('css:minify', ['scss:compile'], () => {
  gulp.src('./public/css/*.css')
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('./public/css'));
});


gulp.task('js:develop', () => {
  bundle();
});


gulp.task('js:compress', ['js:browserify'], () => {
  gulp.src('./public/dest/index.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./public/dest'));
});


gulp.task('js:browserify', () => {
  const b = browserify('./public/javascripts/index.js')
    .transform(babelify);

  b.bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./public/dest'));
});


gulp.task('scss:develop', ['scss:lint', 'scss:compileDev']);


gulp.task('fonts:copy', () => {
  gulp.src(['./node_modules/bootstrap-sass/assets/fonts/bootstrap/*', './node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('./public/dest/fonts'));
});


gulp.task('develop', () => {
  plugins.livereload.listen();

  require('nodemon')({
    script: 'bin/www',
    stdout: true
  }).on('readable', () => {
    this.stdout.on('data', (chunk) => {
      if (/^listening/.test(chunk)) {
        plugins.livereload.reload();
      }
      process.stdout.write(chunk);
    });
  });

  gulp.watch('public/**/*.scss', ['scss:develop']);

  gulp.watch('public/**/!(dest)/**/*.+(jsx|js)', ['js:develop']);
});


gulp.task('build', [
  'fonts:copy',
  'css:minify',
  'js:compress'
]);
