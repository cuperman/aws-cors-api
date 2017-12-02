const gulp = require('gulp');
const shell = require('gulp-shell');
const config = require('../config/deploy');

// TODO: use profile for aws commands
const PROFILE = config.PROFILE;
const S3_BUCKET = config.S3_BUCKET;
const STACK_NAME = config.STACK_NAME || 'aws-cors-api';

const TEMPLATE_FILE = 'template.yaml';
const TEMPLATE_OUTPUT_FILE = 'package/template.yaml';

module.exports = function() {
  gulp.task('deploy:package', shell.task([
    `aws cloudformation package --template-file ${TEMPLATE_FILE} --s3-bucket ${S3_BUCKET} --output-template-file ${TEMPLATE_OUTPUT_FILE}`
  ]));

  gulp.task('deploy:create', ['deploy:package'], shell.task([
    `aws cloudformation deploy --template-file ${TEMPLATE_OUTPUT_FILE} --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM`
  ]));

  gulp.task('deploy:describe', shell.task([
    `aws cloudformation describe-stacks --stack-name ${STACK_NAME}`
  ]));

  gulp.task('deploy:destroy', shell.task([
    `aws cloudformation delete-stack --stack-name ${STACK_NAME}`
  ]));

  gulp.task('deploy', ['deploy:create']);
};
