/* --------------- CONFIG AND SETUP --------------- */
var gulp = require('gulp'),
    del = require('del'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    zip = require('gulp-zip'),
    pkg = require("./package.json");

/* ------------------- FUNCTIONS ------------------- */
var getFiles = function (folder, recursive, includeFullPath, filter) {
    var results = [],
        list = fs.readdirSync(folder);

    list.forEach(function (file) {
        var filePath = folder + '/' + file,
            stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (recursive) {
                results = results.concat(getFiles(filePath, recursive));
            }
        } else {
            if (!filter || file.match(filter)) {
                results.push(includeFullPath ? filePath : file);
            }
        }
    });
    return results;
};

var getFormattedDate = function () {
    var date = new Date(),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + day;
};

/* --------------- COMMON TASKS -------------------- */
gulp.task('update-copyright-year', function () {
    var date = new Date(),
        year = date.getFullYear();

    return gulp.src([
            './site_ru-RU/**/*',
            './admin_ru-RU/**/*',
            './install_ru-RU/**/*',
            './pkg_ru-RU.xml'
        ], {base: '.'})
        .pipe(replace(/\-2015/g, '-' + year))
        .pipe(replace(/\- 2015/g, '- ' + year))
        .pipe(gulp.dest('./'));
});

gulp.task('update-translation-version', function () {
    var date = getFormattedDate();
    return gulp.src([
            './site_ru-RU/**/*.xml',
            './admin_ru-RU/**/*.xml',
            './pkg_ru-RU.xml'
        ], {base: '.'})
        .pipe(replace(/(extension version=")([^"]*)(")/g, '$1' + pkg.joomla.version.substr(0, 3) + '$3'))
        .pipe(replace(/(mainfest version=")([^"]*)(")/g, '$1' + pkg.joomla.version.substr(0, 3) + '$3'))
        .pipe(replace(/(<version>)(.*)(<\/version>)/g, '$1' + pkg.joomla.version + '.' + pkg.translation.version + '$3'))
        .pipe(replace(/(<creationDate>)(.*)(<\/creationDate>)/g, '$1' + date + '$3'))
        .pipe(gulp.dest('./'));
});

/* ---------------- PACKAGE TASKS ----------------- */
gulp.task('package-build-clean', function (cb) {
    del(['./build/**/*'], cb);
});

gulp.task('package-build-copy-files', ['package-build-clean'], function () {
    return gulp.src([
            './site_ru-RU/**/*',
            './admin_ru-RU/**/*',
            'pkg_ru-RU.xml'
        ], {base: '.'})
        .pipe(gulp.dest('./build'));
});

gulp.task('package-build-set-version', ['package-build-copy-files'], function () {
    var date = getFormattedDate();
    return gulp.src([
            './build/**/*.xml'
        ], {base: '.'})
        .pipe(replace(/(extension version=")([^"]*)(")/g, '$1' + pkg.joomla.version.substr(0, 3) + '$3'))
        .pipe(replace(/(mainfest version=")([^"]*)(")/g, '$1' + pkg.joomla.version.substr(0, 3) + '$3'))
        .pipe(replace(/(<version>)(.*)(<\/version>)/g, '$1' + pkg.joomla.version + '.' + pkg.translation.version + '$3'))
        .pipe(replace(/(<creationDate>)(.*)(<\/creationDate>)/g, '$1' + date + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-build-update-site-manifest-files', ['package-build-copy-files', 'package-build-set-version'], function () {
    var files = getFiles('./build/site_ru-RU', true, false, /.(ini|php)/g),
        list = '';

    files.forEach(function (file) {
        list = list + "\t\t" + '<filename>' + file + '</filename>' + "\n";
    });

    return gulp.src([
            './build/site_ru-RU/ru-RU.xml'
        ], {base: '.'})
        .pipe(replace(/(<files>[\n|\r]*)(([\n|\r|\t]*<filename[^>]*>[^<]+<\/filename>[\n|\r|\t]*)+)(<\/files>)/g, '$1' + list + "\t" + '$4' + "\n"))
        .pipe(replace(/(<description>)(.*)(<\/description>)/g, '$1' + pkg.translation.site.description + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-build-update-site-install-files', ['package-build-copy-files', 'package-build-set-version'], function () {
    var files = getFiles('./build/site_ru-RU', true, false, /.(ini|php|html)/g),
        list = '';

    files.push('install.xml');
    files.push('ru-RU.xml');

    files.forEach(function (file) {
        list = list + "\t\t" + (file.match(/.xml/g) ? '<filename file="meta">' : '<filename>') + file + '</filename>' + "\n";
    });

    return gulp.src([
            './build/site_ru-RU/install.xml'
        ], {base: '.'})
        .pipe(replace(/(<files>[\n|\r]*)(([\n|\r|\t]*<filename[^>]*>[^<]+<\/filename>[\n|\r|\t]*)+)(<\/files>)/g, '$1' + list + "\t" + '$4' + "\n"))
        .pipe(replace(/(<description>)(.*)(<\/description>)/g, '$1' + pkg.translation.site.description + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-build-update-admin-manifest-files', ['package-build-copy-files', 'package-build-set-version'], function () {
    var files = getFiles('./build/admin_ru-RU', true, false, /.(ini|php)/g),
        list = '';

    files.forEach(function (file) {
        list = list + "\t\t" + '<filename>' + file + '</filename>' + "\n";
    });

    return gulp.src([
            './build/admin_ru-RU/ru-RU.xml'
        ], {base: '.'})
        .pipe(replace(/(<files>[\n|\r]*)(([\n|\r|\t]*<filename[^>]*>[^<]+<\/filename>[\n|\r|\t]*)+)(<\/files>)/g, '$1' + list + "\t" + '$4' + "\n"))
        .pipe(replace(/(<description>)(.*)(<\/description>)/g, '$1' + pkg.translation.admin.description + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-build-update-admin-install-files', ['package-build-copy-files', 'package-build-set-version'], function () {
    var files = getFiles('./build/admin_ru-RU', true, false, /.(ini|php|html)/g),
        list = '';

    files.push('install.xml');
    files.push('ru-RU.xml');

    files.forEach(function (file) {
        list = list + "\t\t" + (file.match(/.xml/g) ? '<filename file="meta">' : '<filename>') + file + '</filename>' + "\n";
    });

    return gulp.src([
            './build/admin_ru-RU/install.xml'
        ], {base: '.'})
        .pipe(replace(/(<files>[\n|\r]*)(([\n|\r|\t]*<filename[^>]*>[^<]+<\/filename>[\n|\r|\t]*)+)(<\/files>)/g, '$1' + list + "\t" + '$4' + "\n"))
        .pipe(replace(/(<description>)(.*)(<\/description>)/g, '$1' + pkg.translation.admin.description + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-update-package-description', [
    'package-build-copy-files',
    'package-build-update-site-manifest-files',
    'package-build-update-site-install-files',
    'package-build-update-admin-manifest-files',
    'package-build-update-admin-install-files'], function () {
    return gulp.src([
            './build/pkg_ru-RU.xml'
        ], {base: '.'})
        .pipe(replace(/(<description>)(.*)(<\/description>)/g, '$1' + pkg.translation.package.description + '$3'))
        .pipe(gulp.dest('./'));
});

gulp.task('package-build-zip-full', ['package-update-package-description'], function () {
    return gulp.src([
            './build/**/*'
        ])
        .pipe(zip('ru-RU_joomla_lang_full_' + pkg.joomla.version + 'v' + pkg.translation.version + '.zip'))
        .pipe(gulp.dest('./build'));
});

gulp.task('package-build-zip', ['package-build-zip-full'], function (cb) {
    del([
        './build/site_ru-RU/',
        './build/admin_ru-RU/',
        './build/pkg_ru-RU.xml'
    ], cb);
});

/* ---------------- RUN TASKS ---------------- */
gulp.task('default', ['package-build-zip']);
gulp.task('copyright', ['update-copyright-year']);
gulp.task('version', ['update-translation-version']);