const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
const nodeSass = require('node-sass');

sass.compiler = nodeSass;

const paths = {
  src: {
    base: 'src/',
    js: 'src/js/**/*.js',
    sass: 'src/sass/**/*.sass',
    img: 'src/img/**/*.*',
    html: 'src/**/*.html',
  },
  out: {
    base: 'public/',
    css: 'public/css',
    js: 'public/js',
    img: 'public/img',
    html: 'public/',
  },
  baseDir: 'public/',
};

// Build js
const scripts = () => {
  return gulp.src(paths.src.js).
      pipe(concat('main.js')).
      pipe(gulp.dest(paths.out.js));
};

// Build sass => css
const styles = () => {
  return gulp.src(paths.src.sass).
      pipe(sass().on('error', sass.logError)).
      pipe(gulp.dest(paths.out.css)).
      pipe(browserSync.stream());
};

// Build images
const images = () => {
  return gulp.src(paths.src.img).
      pipe(gulp.dest(paths.out.img));
};

// Build html
const html = () => {
  return gulp.src(paths.src.html).
    pipe(gulp.dest(paths.out.html));
};

// Force reload
const reload = (done) => {
  browserSync.reload();
  done();
};

// Build all files
const build = gulp.series(scripts, images, styles, html); 

// Init browser sync
const server = () => {
  browserSync.init({
    server: paths.baseDir,
  });

  gulp.watch(paths.src.sass, styles);
  gulp.watch([paths.src.img, paths.src.js, paths.src.html], gulp.series(build, reload));
}

// Static server
gulp.task('serve', gulp.series(build, server));

// Clean build directory 
gulp.task('clean', function() {
  return del([paths.out.base + '**', `!${paths.out.base}`], {force:true});
});