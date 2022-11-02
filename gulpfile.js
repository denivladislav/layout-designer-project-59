const { parallel, src, dest, watch } = require('gulp');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const pugLint = require('gulp-pug-linter');
const sassLint = require('gulp-stylelint');
const sprite = require('gulp-svg-sprite');
const concat = require('gulp-concat');

const cleanJob = (done) => {
  src('./build/', {read: false})
    .pipe(clean());

  done();
}

const browserSyncJob = () => {
  browserSync.init({
    server: { baseDir: './build/' }
  });

  watch('./app/scss/**/*.scss', sassCompileJob);
  watch('./app/pug/**/*.pug', pugCompileJob);
};

const sassLintJob = () => {
  return src('./app/scss/**/*.scss')
    .pipe(sassLint({ fix: true }));
}

const pugLintJob = () => {
  return src('./app/pug/**/*.pug')
    .pipe(pugLint({ reporter: 'default' }));
}

const sassCompileJob = (done) => {
  // sassLintJob();

  src('./app/scss/app.scss')
    .pipe(sass())
    .pipe(dest('./build/styles'))
    .pipe(browserSync.stream());

  done();
};

const pugCompileJob = (done) => {
  pugLintJob();

  src('./app/pug/**/*.pug')
    .pipe(pugLint({ reporter: 'default', fix: true }))
    .pipe(pug({ pretty: true }))
    .pipe(dest('./build'))
    .pipe(browserSync.stream());

  done();
};

const imagesCompileJob = (done) => {
  src('./app/images/**/*.svg')
    .pipe(sprite({mode: {stack: {sprite: "../sprite.svg"}}}))
    .pipe(dest('./build/images'))

  src('./app/images/**/*.jpg')
    .pipe(dest('./build/images'))
  
  done();
}

exports.server = browserSyncJob;
exports.lint = parallel(sassLintJob, pugLintJob);
exports.clean = cleanJob;

exports.default = parallel(sassCompileJob, pugCompileJob, imagesCompileJob);
