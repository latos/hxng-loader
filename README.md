# hxng-loader
Simple angular template webpack loader.

Usage:
```
  var myTplName = require('./foo.ng.html');
```

Key Features:
  - object returned by require is the template name
    so it can be conveniently referred to. (as a side
    effect, the content is loaded into the ng template cache).
  - name is globally unique and stable, no clashes with
    same file names in other directories.
  - html is minified.


## Setup

Add this loader to webpack.config.js:

```
  module: {
    loaders: [
      {
        test: /\.ng.html$/,
        loader: 'hxng-loader'
      },
      ...
    ],

    ...
  }

```

Add this code to your top level js code
(needs to run before template require statements):

```
  yourModule.run(function ($templateCache) {
    window.$templateCache = $templateCache;
  });
```

This is needed so that async code loading containing templates can work - it can't self-bootstrap.

TODO: Automate the above bootstrapping code.
