const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const fileInclude = require('gulp-file-include');
const del = require('del');
const group_media = require('gulp-group-css-media-queries');
//const webp = require('gulp-webp');
//const webphtml = require('gulp-webp-html');
//const webpcss = require('gulp-webp-css');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const fs = require('fs');
const uglifyJs = require('gulp-uglify-es').default;


gulp.task('server', function () {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("src/img/**/*.+(jpg|jpeg|png|gif").on('change', browserSync.reload);
    gulp.watch("src/icons/**/*.+(svg|png|gif").on('change', browserSync.reload);
});

gulp.task('styles', function () {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(group_media())
        .pipe(autoprefixer({ overrideBrowserslist: ["last 5 versions"], cascade: true }))
        //.pipe(webpcss())
        .pipe(gulp.dest("dist/css"))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/**/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
    gulp.watch("src/images/**/*").on('change', gulp.parallel('images'));
    gulp.watch("src/icons/**/*").on('change', gulp.parallel('icons'));
});

gulp.task('html', function () {
    return gulp.src(["src/*.html", "!src/_*.html", "src/**/*.html", "!src/**/_*.html"])
        .pipe(fileInclude())
        //.pipe(webphtml())
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function () {
    return gulp.src(["src/js/*.js", "!src/js/**/_*.js"])
        .pipe(fileInclude())
        .pipe(gulp.dest("dist/js"))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(uglifyJs())
        .pipe(gulp.dest("dist/js"));
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(ttf2woff())
        .pipe(gulp.dest("dist/fonts"))
    return gulp.src("src/fonts/**/*")
        .pipe(ttf2woff2())
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*")
        //.pipe(webp({ quality: 70 }))
        //.pipe(gulp.dest("dist/icons"))
        //.pipe(gulp.src("src/icons/**/*"))
        .pipe(imagemin({ progressive: true, svgoPlugins: [{ removeViewBox: false }], interlaced: true, optimizationLevel: 3 }))
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

gulp.task('otf2ttf', function () {
    return src("src/fonts/*.otf")
        .pipe(fonter({ formats: ['ttf'] }))
        .pipe(gulp.dest("src/fonts"));
});

gulp.task('svgSprite', function () {
    return gulp.src(["src/iconsprite/*.svg"])
        .pipe(svgSprite({ mode: { stack: { sprite: "../icons/icons.svg" } } }))
        .pipe(gulp.dest("dist/img"));
});

gulp.task('mailer', function () {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest("dist/mailer"));
});

gulp.task('docs', function () {
    return gulp.src("src/docs/**/*")
        .pipe(gulp.dest("dist/docs"));
});

gulp.task('video', function () {
    return gulp.src("src/video/**/*")
        .pipe(gulp.dest("dist/video"));
});

gulp.task('admin', function () {
    return gulp.src("src/admin/**/*")
        .pipe(gulp.dest("dist/admin"));
});

gulp.task('fontsStyle', function () {
    let file_content = fs.readFileSync('src/sass/base/_fonts.scss');
    if (file_content == '') {
        fs.writeFile('src/sass/base/_fonts.scss', '', cb);
        return fs.readdir('dist/fonts/', function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile('src/sass/base/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
});

function cb() {

}

gulp.task('images', function () {
    return gulp.src("src/img/**/*")
        //.pipe(webp({ quality: 70 }))
        //.pipe(gulp.dest("dist/img"))
        //.pipe(gulp.src("src/img/**/*"))
        .pipe(imagemin({ progressive: true, svgoPlugins: [{ removeViewBox: false }], interlaced: true, optimizationLevel: 3 }))
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
});

gulp.task('clean', function () {
    return del("dist/");
});

gulp.task('series', gulp.series('clean', gulp.parallel('html', 'styles', 'scripts', 'fonts', 'icons', 'mailer', 'video', 'docs', 'admin', 'images', 'fontsStyle')));
gulp.task('default', gulp.parallel('series', 'watch', 'server'));