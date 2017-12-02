const gulp = require('gulp');
const shell = require('gulp-shell');

const PACKAGE_DIR = 'package';
const PACKAGE_NAME = 'aws-cors-api';
const PACKAGE_FILES = 'handlers index.js package.json'

module.exports = function() {
  gulp.task('build:clean', shell.task([
    `rm -rf ${PACKAGE_DIR}/*`
  ]));

  gulp.task('build:package', ['build:clean'], shell.task([
    `mkdir -p ${PACKAGE_DIR}/${PACKAGE_NAME}`,
    `cp -r ${PACKAGE_FILES} ${PACKAGE_DIR}/${PACKAGE_NAME}`
  ]));

  gulp.task('build:zip', ['build:package'], shell.task([
    `zip -r ../${PACKAGE_NAME}.zip *`
  ], {
    cwd: `${PACKAGE_DIR}/${PACKAGE_NAME}`
  }));

  gulp.task('build', ['build:zip']);
};
