var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var jshint = require('gulp-jshint');
var cache = require('gulp-cache');

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
}

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);

        combined.on('error', handleError);
    })
})

gulp.task('scripts', function(){
  var combined = combiner.obj([
    gulp.src('src/js/**/*.js'),
    jshint('.jshintrc'),
    jshint.reporter('default'),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest('dist/js/')
  ]);
  combined.on('error', handleError);
})

gulp.task('watchcss',function(){
    gulp.watch(golb('src/css/**/*.css'),function(event){
      var paths = watchPath(event,'src/','dist/');
      
      gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
      gutil.log('Dist ' + paths.distPath);
      
      gulp.src(paths.srcPath)
          .pipe(sourcemaps.init())
          .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
          }))
          .pipe(minifycss())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(paths.distDir))
    });
})

gulp.task('minifycss', function(){
  gulp.src('src/css/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: 'last 2 versions'
      }))
      .pipe(minifycss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css/'))
})

gulp.task('watchless', function(){
    gulp.watch('src/less/**/*.less', function(event){
      var paths = watchPath(event,'src/less/','dist/css/')
      
      gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
      gutil.log('Dist' + paths.distPath)
      
      var combined = combiner.obj([
        gulp.src(paths.srcPath),
        sourcemaps.init(),
        less(),
        autoprefixer({
          browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }),
        minifycss(),
        sourcemaps.write('./'),
        gulp.dest(paths.distDir)
      ])
      combined.on('error', handleError)
    })
})

gulp.task('lesscss', function(){

  var combined = combiner.obj([
    gulp.src(['src/less/CCD.less','src/less/custom/*.less']),
    sourcemaps.init(),
    less(),
    autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    }),
    minifycss(),
    sourcemaps.write('./'),
    gulp.dest('dist/css/')
  ])
  combined.on('error', handleError)
})

gulp.task('watchimage', function(){
  gulp.watch('src/images/**/*', function(event){
    var paths = watchPath(event,'src/images/','dist/images/')
      
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist' + paths.distPath)
    
    gulp.src(paths.srcPath)
        .pipe(cache(imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        })))
        .pipe(gulp.dest(paths.distDir))
  })
})

gulp.task('image',function(){
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})


gulp.task('build',function(){
  del('dist/build',function(err,paths){

    //应该有更优雅的做法
    gulp.src('dist/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist/build/css'))
        .pipe(rev.manifest('css-manifest.json'))
        .pipe(gulp.dest('dist/build'));
    
    gulp.src('dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/build/js'))
        .pipe(rev.manifest('js-manifest.json'))
        .pipe(gulp.dest('dist/build'));
    gulp.src('dist/images/*')
        .pipe(rev())
        .pipe(gulp.dest('dist/build/images'))
        .pipe(rev.manifest('js-manifest.json'))
        .pipe(gulp.dest('dist/build'));
  });
})

gulp.task('default', ['watchjs','watchcss','watchless','watchimage'])