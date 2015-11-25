# gulp-css-adjust-url-path

Correct the url-property inside CSS to make absolute paths relative, no matter where the CSS files are located.

Imagine, if you will, the following structure of your application:
```
/root
  assets
      fonts
          font.woff
          ...
  module
    module.scss
    
    submodule
      submodule.scss
  styles.scss
```

Using this structure it would be easy to define in the styles.scss that the fonts are located in
```
@font-face {
    font-family: FONT; 
    src: url(/assets/fonts/font.woff);
}
```
Up until here: No problem, all is good, no plugin needed.

Now imagine further, if you will, that you push your application to another environment which might look something like this:
```
/root
  websites
    customer
      project
        assets
            fonts
                font.woff
                ...
        module
          module.scss
          
          submodule
            submodule.scss
        _fonts.scss
        styles.scss
```

If you don't have access to the server config and if you have to accept that the url of your index file will be http://server.dev/websites/customer/project/index.html instead of http://server.dev/index.html then you are going to have a bad time with your absolutely referenced uris.

Generally it would be best to avoid using absolute uris. But some benefits from css preprocessing would be lost, if one had to avoid absolute uris altogether.

This is where this plugin comes in. It adjusts your (compiled) css so that all findings of ```url:(...)``` are corrected in a way that they will all be granted a relative uri where an absolute uri has been.

For example: The above mentioned files might have contained something like this:
```
_fonts.scss:
@font-face {
    font-family: FONT; 
    src: url(assets/fonts/font.woff);
}

module.scss:
@import '../fonts';

submodule.scss:
@import '../../fonts';
```

The compiled css would contain something like this:
```
module.css:
@font-face {
    font-family: FONT; 
    src: url(assets/fonts/font.woff); <- WRONG, assets folder is not on same level as module.scss
}

submodule.css:
@font-face {
    font-family: FONT; 
    src: url(assets/fonts/font.woff); <- WRONG, assets folder is not on same level as submodule.scss
}
```

If the font were to be defined with an absolute uri then a problem would arise with aforementioned server structure because root would then be on a totally different position.

Using this plugin the output of the css would become this:
```
module.css:
@font-face {
    font-family: FONT; 
    src: url(../assets/fonts/font.woff); <- CORRECT
}

submodule.css:
@font-face {
    font-family: FONT; 
    src: url(../../assets/fonts/font.woff); <- CORRECT
}
```

## Install

```
$ npm install --save-dev gulp-css-adjust-url-path
```


## Usage

To make this plugin work you must create a valid regex object that describes your url.

In your gulpfile you should pipe the module like this:

```
var cssAdjustUrlPath = require('gulp-css-adjust-url-path');

[some gulp task]
  .pipe(cssAdjustUrlPath(/(url\(['"]?)[/]?(assets)/g))
```

As you can see: The regex defines two capturing groups. One group grabs the first part ```url(``` (with or without quotation marks) and the second part grabs something after that, something that makes it clear for the plugin which url-definitions to mutate. Of course, if all uris are to be changed, then the second capturing group could contain nothing.

Beware of using the g modifier. Without it only the first finding inside a file would be corrected.

## License

MIT © [Tobias Winkler](http://tobiaswinkler.berlin)
