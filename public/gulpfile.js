var gulp		  = require('gulp'),
	sass		  = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat	      = require('gulp-concat'),
	uglify	      = require('gulp-uglifyjs'),
	cssnano	      = require('gulp-cssnano'),
	rename	      = require('gulp-rename'),
	del		      = require('del'),
	imagemin	  = require('gulp-imagemin'),
	pngquant	  = require('imagemin-pngquant'),
	cache		  = require('gulp-cache'),
	autoprefixer  = require('gulp-autoprefixer'),
	svgSprite	  = require("gulp-svg-sprite"),
	spritesmith   = require('gulp.spritesmith'),
	fileinclude   = require('gulp-file-include');

// таск для компиляции scss в css
gulp.task('sass', function() {
	return gulp.src('html/scss/style.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('html/css'))
	.pipe(browserSync.reload({stream: true}))
});

// таск для сжатия и объединения js файлов
gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'html/js/libs/jquery-2.2.2.min.js',
		'html/js/libs/jquery.formstyler.min.js',
		'html/js/libs/input-mask.min.js',
		'html/js/libs/slick.min.js',
		'html/js/libs/object-fit-polyfill.js',
		'html/js/partials/script.js',
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		//.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('html/js')); // Выгружаем в папку app/js
});

// конфиг для создания спрайтов
// https://github.com/jkphl/gulp-svg-sprite#basic-example
var svgSpriteConfig = {
	dest : '.',
	mode : {
		 css : {
			 dest : '.',
			 sprite : 'html/images/sprite.svg',
			 render : {
				 css : {dest : 'html/css/sprite.css'},
				 scss : {
					 dest : 'html/scss/sprite.scss'
				 }
			 },
		 }
	 }
 };

// таск для создания спрайтов из png картинок
gulp.task('sprite', function () {
    var spriteData = gulp.src('html/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '/images/sprite.png',
        cssName: 'sprite.scss',
        algorithm: 'diagonal',
        paddingg: 15
    }));
    spriteData.img.pipe(gulp.dest('html/images/'));
    spriteData.css.pipe(gulp.dest('html/scss/components/'));
});

// таск для создания спрайтов из svg картинок
gulp.task('svg:build', function () {
	return gulp.src('html/images/svg/*.svg')
		.pipe(svgSprite(svgSpriteConfig))
		.pipe(gulp.dest("."));
});

// fileinclude - простейший шабланизатор
gulp.task('fileinclude', function()
{
	gulp.src('html/src/*.html') // откуда брать файлы
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(gulp.dest("./html")); // сюда кладется скомпилированные html файлы
});

// таск для обновления страницы
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'html'
		},
		notify: false
	})
});

// таск следит за изменениями файлов и вызывает другие таски
gulp.task('watch', function() {
	gulp.watch('html/scss/**/*.scss',['sass']);
	gulp.watch(['html/src/*.html','html/src/inc/**/*.html'],['fileinclude']);
	gulp.watch(['html/js/libs/*.js', 'html/js/partials/*.js'],['scripts']);
	gulp.watch('html/inc/*.html', browserSync.reload);
	gulp.watch('html/**/*.html', browserSync.reload);
	gulp.watch('html/js/*.js', browserSync.reload);
});

// таск сжимает картинки без потери качества 
gulp.task('img', function() {
	return gulp.src('html/images/**/*') // откуда брать картинки
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img')) // куда класть сжатые картинки
});

// основной таск, который запускает вспомогательные 
gulp.task('default', ['browser-sync','watch', 'sass', 'fileinclude', 'scripts']);