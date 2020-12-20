var gulp             = require('gulp'),
	sass             = require('gulp-sass'),
	browserSync      = require('browser-sync'),
	concat           = require('gulp-concat'),
	uglify           = require('gulp-uglify'),
	imagemin         = require('gulp-imagemin'),
	autoprefixer     = require('gulp-autoprefixer'),
	babel            = require('gulp-babel'),
	plumber          = require('gulp-plumber'),
	twig             = require('gulp-twig'),
	cheerio          = require('gulp-cheerio'),
	path             = require('path'),
	htmlbeautify     = require('gulp-html-beautify'),
	svgmin           = require('gulp-svgmin'),
	webp 			 = require('gulp-webp'),
	gcmq             = require('gulp-group-css-media-queries');

// таск для компиляции scss в css
gulp.task('sass', () =>
{
	return gulp.src('src/assets/scss/style.scss')
		.pipe(sass({includePaths: ['src/']}).on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
		.pipe(gcmq())
		.pipe(gulp.dest('pages'))
		.pipe(browserSync.reload({stream: true}));
});

// файлы для сборки
var jsFiles = ['src/assets/js/*.js', 'src/**/*.js'];

// таск для объединения js файлов
gulp.task('scripts', () =>
{
	process.env.NODE_ENV = "release";
	return gulp.src(jsFiles)
		.pipe(babel())
		.pipe(concat('main.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('pages'))
		.pipe(browserSync.reload({stream: true}));
});

// таск для сборки, транспалирования и сжатия скриптов
gulp.task('scripts-build', () =>
{
	process.env.NODE_ENV = "release";
	return gulp.src(jsFiles)
		.pipe(babel())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('pages'));
});

// приводим впорядок скомпилированный код после pug-a
gulp.task('htmlbeautify', () =>
{
	var options = {
		indentSize: 4,
		unformatted: [
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

gulp.task('twig', function ()
{
	return gulp.src(['./src/*.twig'])
		.pipe(plumber())
		.pipe(twig({base:'./src/'}))
		.pipe(htmlbeautify())
		.pipe(gulp.dest("pages/",))
		.pipe(browserSync.reload({stream: true}));
});

// таск для обновления страницы
gulp.task('browser-sync', () =>
{
	browserSync({
		server: {baseDir: './pages/'},
		startPath: './ui-kit.html',
		serveStaticOptions: {extensions: ["html"] },
		ghostMode: {scroll: false },
		notify: false,
	});
});

// таск следит за изменениями файлов и вызывает другие таски
gulp.task('watch', function()
{
	gulp.watch(['scss/**/*.scss','src/**/*.scss'], gulp.parallel('sass'));
	gulp.watch('src/**/*.twig', gulp.parallel('twig'));
	gulp.watch(['src/**/*.js'], gulp.parallel('scripts'));
	gulp.watch('src/**/*.js', gulp.parallel(() => { browserSync.reload(); }));
	gulp.watch('img/*', gulp.parallel(() => { browserSync.reload(); }));
});

// таск сжимает картинки
gulp.task('img', function()
{
	return gulp.src(['src/assets/img/*.png', 'src/assets/img/*.jpg']) // откуда брать картинки
		.pipe(imagemin([imagemin.gifsicle(), imagemin.optipng(), imagemin.svgo() ]))
		.pipe(gulp.dest('pages/img/'))
		.pipe(webp())
		.pipe(gulp.dest('pages/img/'));
});

gulp.task('svg-min', () =>
{
	return gulp.src('src/assets/svg/*.svg')
		.pipe(
			svgmin(file =>
			{
				const { relative } = file;
				const prefix = path.basename(relative, path.extname(relative));
				return {
					js2svg: {pretty: true, },
					plugins: [
						{cleanupIDs: { prefix: '${prefix}-' + Math.floor(Math.random() * (100 - 10)) + 10 }, },
						{removeDoctype: true, },
						{removeXMLProcInst: true, },
						{removeViewBox: false },
						{removeTitle: true, },
						{removeDesc: { removeAny: true }, },
						{convertTransform: {}, },
					],
				};
			}))
		.pipe(
			cheerio({
				run: ($, file) =>
				{
					const $clipPath = $('clipPath');
					const $mask = $('mask');
					let $defs = $('defs');
					const hasClipPath = $clipPath.length > 0;
					const hasMask = $mask.length > 0;
					const hasDefs = $defs.length > 0;

					if (!hasClipPath && !hasMask) return;

					if (!hasDefs)
					{
						$defs = $('<defs></defs>');
						$defs.prependTo('svg');
					}

					function copyToDefs(i, el)
					{
						const $el = $(el);
						const $clone = $el.clone();
						$clone.appendTo($defs);
						$el.remove();
					}
					if (hasClipPath) $clipPath.each(copyToDefs);
					if (hasMask) $mask.each(copyToDefs);
				},
				parserOptions: {xmlMode: true, },
			})
		)
		.pipe(gulp.dest('pages/svg'));
});

// сборка проекта
gulp.task('build', gulp.series('svg-min', 'sass', 'twig', 'scripts-build', 'img', async () => { console.log('builded');}));

// основной таск, который запускает вспомогательные
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'twig', 'svg-min', 'scripts', () => { console.log('dev start');}));