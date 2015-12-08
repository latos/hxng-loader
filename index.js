/**
 * Simple angular template webpack loader.
 *
 * Usage:
 *   var myTplName = require('./foo.ng.html');
 *
 * Key Features:
 *   - object returned by require is the template name
 *     so it can be conveniently referred to. (as a side
 *     effect, the content is loaded into the ng template cache).
 *   - name is globally unique and stable, no clashes with
 *     same file names in other directories.
 *   - html is minified.
 */

var escapeJs = require('js-string-escape');
var htmlMinifier = require('html-minifier');

// NOTE(dan): Not sure how to get the project-relative path of
// a resource (resourcePath is the full system path)
// So, to hide it, we'll just hash it, and for debuggability
// append just the filename.
var crypto = require('crypto');

module.exports = function (source) {

  // standard boilerplate to make sure webpack caches this,
  // if the source file is unchanged.  read the webpack docs.
  this.cacheable && this.cacheable();

  // Copy pasted rules from ng-cache-loader.
  source = htmlMinifier.minify(source, {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true
  });

  var resource = this.resourcePath;
  var basename = resource.replace(/.*\//, '');
  var name = '.hxng/' + basename + '/' + hash(resource);

  return (
    'window.$templateCache.put("' + name + '", "' + 
    escapeJs(source) + '");' +
    'module.exports = "' + name + '";');

};

function hash(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);

  return shasum.digest('hex');
}
