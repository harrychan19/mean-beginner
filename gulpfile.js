/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

var gulp = require("gulp"),
    livereload = require("gulp-livereload");

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(["views/**", "public/**"]).on("change", livereload.changed);
});