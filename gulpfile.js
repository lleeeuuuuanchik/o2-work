var gulp             = require('gulp'),
	sass             = require('gulp-sass');
	browserSync      = require('browser-sync'),
	concat           = require('gulp-concat'),
	uglify           = require('gulp-uglify')
	cssnano          = require('gulp-cssnano'),
	rename           = require('gulp-rename'),
	del              = require('del'),
	imagemin         = require('gulp-imagemin'),
	pngquant         = require('imagemin-pngquant'),
	cache            = require('gulp-cache'),
	autoprefixer     = require('gulp-autoprefixer'),
	babel            = require('gulp-babel'),
	imageminZopfli   = require('imagemin-zopfli'),
	imageminMozjpeg  = require('imagemin-mozjpeg'),
	imageminGiflossy = require('imagemin-giflossy'),
	plumber          = require('gulp-plumber'),
	twig             = require('gulp-twig'),
	gulpif           = require('gulp-if'),
	svgmin           = require('gulp-svgmin'),
	htmlbeautify     = require('gulp-html-beautify'),
	cheerio          = require('gulp-cheerio')
	path             = require('path'),
	svgSymbols       = require('gulp-svg-symbols'),
	gcmq             = require('gulp-group-css-media-queries');

// таск для компиляции scss в css
gulp.task('sass', () => {
	return gulp.src('scss/style.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
	.pipe(gcmq())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}))
});

// файлы для сборки
var jsFiles = [
	'node_modules/jquery/dist/jquery.min.js',
	'js/vendors/*.js',
	'js/main.js',
];

// таск для объединения js файлов
gulp.task('scripts', () => {
	return gulp.src(jsFiles)
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('js'))
		.pipe(browserSync.reload({stream: true}))

});

gulp.task('clean', function () {
	del('img/svg-for-min/*.svg', {force:true});
});

// сжимаем и оптимизируем svg картинки
gulp.task('svg-min', () => {
	return gulp.src('./img/svg-for-min/*.svg')
		.pipe(
			svgmin(file => {
				const { relative } = file
				const prefix = path.basename(relative, path.extname(relative))
				return {
					js2svg: {
						pretty: true,
					},
					plugins: [
						{
							// this prevent duplicated IDs when bundled in the same file
							cleanupIDs: { prefix: '${prefix}-' + Math.floor(Math.random() * (100 - 10)) + 10 },
						},
						{
							// some cleaning
							removeDoctype: true,
						},
						{
							removeXMLProcInst: true,
						},
						{
							removeViewBox: false
						},
						{
							removeTitle: true,
						},
						{
							removeDesc: { removeAny: true },
						},
						{
							convertTransform: {},
						},
					],
				}
			})
		)
		// We need to move <clipPath> and <Mask> to the defs…
		// …in order for Firefox to render the SVG correctly
		.pipe(
			cheerio({
				run: ($, file) => {
					const $clipPath = $('clipPath')
					const $mask = $('mask')
					let $defs = $('defs')
					const hasClipPath = $clipPath.length > 0
					const hasMask = $mask.length > 0
					const hasDefs = $defs.length > 0

					if (!hasClipPath && !hasMask) return

					if (!hasDefs) {
						$defs = $('<defs></defs>')
						$defs.prependTo('svg')
					}

					function copyToDefs(i, el) {
						const $el = $(el)
						const $clone = $el.clone()
						$clone.appendTo($defs)
						$el.remove()
					}

					if (hasClipPath) $clipPath.each(copyToDefs)
						if (hasMask) $mask.each(copyToDefs)
				},
				parserOptions: {
					xmlMode: true,
				},
			})
		)
		.pipe(gulp.dest('./img/svg-for-sprite'))
		.on('end', () => {del('./img/svg-for-min/*.svg', {force:true})})
})

// собираем инлайн спрайт из svg иконок + собираем страницу для просмотра всех иконок
gulp.task('svg-sprite', function() {
	return gulp.src('img/svg-for-sprite/*.svg')
		.pipe(
			svgSymbols(
				{
					svgAttrs: { class: 'svg-symbol', fill: 'none'},
					templates: ['default-svg', 'default-demo', 'default-scss']
				}
			)
		)
		.pipe(gulpif(/[.]svg$/, gulp.dest('./img')))
		.pipe(gulpif(/[.]html$/, gulp.dest('./')))
		.pipe(gulpif(/[.]scss$/, gulp.dest('scss')))
})


// таск для сборки, транспалирования и сжатия скриптов
gulp.task('scripts-build', () => {
	return gulp.src(jsFiles)
		.pipe(babel({
			presets: ['@babel/preset-env']
		})) // транспалируем из es6
		.pipe(concat('main.min.js'))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('js')); // Выгружаем в папку app/js
});

// приводим впорядок скомпилированный код после pug-a
gulp.task('htmlbeautify', () => {
	var options = {
		indentSize: 4,
		unformatted: [
			// https://www.w3.org/TR/html5/dom.html#phrasing-content
			 'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
			'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
			'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
			 'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
			'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt', 'a'
		],
		"indent_char": " ",
		"indent_level": 1,
		"indent_with_tabs": false,
	};
	gulp.src('./*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('./'));
});

gulp.task('twig', function () {
	return gulp.src(['./src/*.twig'])
	// Stay live and reload on error
	.pipe(plumber())
	.pipe(twig())
	.pipe(htmlbeautify())
	.pipe(gulp.dest("./"))
	.pipe(browserSync.reload({stream: true}))
});

// таск для обновления страницы
gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: './'
		},
		serveStaticOptions: {
			extensions: ["html"]
		},
		ghostMode: {
			scroll: false
		},
		notify: false,
	})
});

// gulp.task('svg-containing-identical-id', svgContainingIdenticalId)

// таск следит за изменениями файлов и вызывает другие таски
gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('src/**/*.twig', gulp.parallel('twig'));
	gulp.watch(['js/vendors/*.js', 'js/main.js', 'js/modules/*.js'], gulp.parallel('scripts'));
	gulp.watch(['img/svg-for-min/*'], {events: ['all']}, gulp.series('svg-min', 'svg-sprite'));
	gulp.watch('img/svg-for-sprite/*', {events: ['all']}, gulp.series('svg-sprite', 'twig'));
	gulp.watch('./*.html', gulp.parallel(() => { browserSync.reload(); }));
	gulp.watch('js/*.js', gulp.parallel(() => { browserSync.reload(); }));
	gulp.watch('img/*', gulp.parallel(() => { browserSync.reload(); }));
});

// таск сжимает картинки без потери качества
gulp.task('img', () => {
	return gulp.src(['img/*.png', 'img/*.jpg']) // откуда брать картинки
	.pipe(cache(
		imagemin([
			//png
			pngquant({
				speed: 1,
				quality: 80 //lossy settings
			}),
			imageminZopfli({
				more: true,
				iterations: 50 // very slow but more effective
			}),
			//jpg lossless
			imagemin.jpegtran({
				progressive: true
			}),
			//jpg very light lossy, use vs jpegtran
			imageminMozjpeg({
				quality: 85
			})
		])
	))
	.pipe(gulp.dest('img/')) // куда класть сжатые картинки
});

// сборка проекта
gulp.task('build', gulp.series('svg-min', 'svg-sprite', 'sass', 'twig', 'scripts-build', 'img', () => { console.log('builded');}))

// основной таск, который запускает вспомогательные
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'twig', 'svg-min', 'svg-sprite', 'scripts', () => { console.log('dev start');}));