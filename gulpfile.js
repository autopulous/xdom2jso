var gulp = require('gulp');

var del = require('del');

gulp.task('delete-node-modules', function () {
    var patterns = ['node_modules/'];
    console.log('deleting: ' + patterns);
    return del(patterns);
});

gulp.task('clean', function () {
    var patterns = ['app/', 'tst/', 'map/', './*.log', 'distro/'];
    console.log('deleting: ' + patterns);
    return del(patterns);
});

gulp.task('build-app', ['clean'], function () {
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

    return gulp.src(['!src/**/spec.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescriptProject)
        .pipe(sourcemaps.write('../map/'))
        .pipe(gulp.dest('app/'))
        .pipe(typescriptCompiler);
});

gulp.task('build-tst', function () {
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

    return gulp.src('src/**/*.js')
        .pipe(gulp.dest('app/'));
});

gulp.task('build-distro', function () {
    gulp.src('src/package.json')
        .pipe(gulp.dest('distro/'));

    gulp.src('app/**/')
        .pipe(gulp.dest('distro/'));

    return gulp.src('README.md')
        .pipe(gulp.dest('distro/'));
});

gulp.task('build', ['build-app', 'build-tst']);

gulp.task('clean-build-app', ['clean'], function () {
    return gulp.start('build-app');
});

gulp.task('clean-build-tst', ['clean-build-app'], function () {
    return gulp.start('build-tst');
});

gulp.task('clean-build-distro', ['clean', 'build-app'], function () {
    return gulp.start('build-distro');
});

gulp.task('default', ['clean-build-tst'], function () {
    gulp.watch(['!src/**/spec.ts', 'src/**/*'], ['build-app']);
    gulp.watch('src/**/spec.ts', ['build-tst']);
});