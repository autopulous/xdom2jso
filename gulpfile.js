var gulp = require('gulp');

var del = require('del');

gulp.task('delete-node-modules', function () {
    var patterns = ['node_modules/'];
    console.log('deleting: ' + patterns);
    return del(patterns);
});

gulp.task('clean', function () {
    var patterns = ['app/', 'tst/', 'map/', './*.log'];
    console.log('deleting: ' + patterns);
    return del(patterns);
});

gulp.task('build-app', function (gulpTaskCallback) {
    var imagemin = require('gulp-imagemin');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    var precss = require('precss');
    var cssnano = require('cssnano');
    var ext_replace = require('gulp-ext-replace');
    var sourcemaps = require('gulp-sourcemaps');

    gulp.src('src/**/*.+(ico|gif|jpg|png)')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('app/'));

    gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([precss, autoprefixer, cssnano]))
        .pipe(sourcemaps.write('../map/'))
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest('app/'));

    gulp.src('src/**/*.html')
        .pipe(gulp.dest('app/'));

    var typescript = require('gulp-typescript');
    var typescriptCompiler = typescript({typescript: require('ntypescript')});
    var typescriptProject = typescript(typescript.createProject('tsconfig.json'));

    gulp.src(['!src/**/spec.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescriptProject)
        .pipe(sourcemaps.write('../map/'))
        .pipe(gulp.dest('app/'))
        .pipe(typescriptCompiler);

    gulpTaskCallback();
});

gulp.task('build-tst', function (gulpTaskCallback) {
    var sourcemaps = require('gulp-sourcemaps');

    var typescript = require('gulp-typescript');
    var typescriptCompiler = typescript({typescript: require('ntypescript')});
    var typescriptProject = typescript(typescript.createProject('tsconfig.json'));

    gulp.src('src/**/spec.ts')
        .pipe(sourcemaps.init())
        .pipe(typescriptProject)
        .pipe(sourcemaps.write('../map/'))
        .pipe(gulp.dest('app/'))
        .pipe(typescriptCompiler);

    gulp.src('src/**/*.js')
        .pipe(gulp.dest('app/'));

    gulpTaskCallback();
});

gulp.task('build', ['build-app', 'build-tst']);

var runSequence = require('run-sequence');

gulp.task('clean-build-app', function (gulpTaskCallback) {
    runSequence('clean', 'build-app', gulpTaskCallback);
});

gulp.task('clean-build-tst', function (gulpTaskCallback) {
    runSequence('clean-build-app', 'build-tst', gulpTaskCallback);
});

gulp.task('default', ['clean-build-tst'], function () {
    gulp.watch(['!src/**/spec.ts', 'src/**/*'], ['build-app']);
    gulp.watch('src/**/spec.ts', ['build-tst']);
});