[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# connect-gettext

Lightweight implementation of gettext as connect middleware.

## Install

```sh
$ npm install --save connect-gettext
```

## Usage

Use with any middleware that sets `req.lang` - such as [detect-language] and/or [overwrite-language].

```js
var app = require('express');

var locale = {
  supportedLanguages: ['de', 'fr', 'pl', 'en-GB', 'en-US'],
  defaultLanguage: 'en',
  gettextAlias: '_'
};

// use any middleware that sets req.lang
// `detect-language` is just an example
app.use(require('detect-language')(locale));


app.use(require('connect-gettext')(locale));

```

Once the middleware is applied `res.locals.gettext` will have `gettext` implementation inserted
and `res.render` will be able to use it when rendering pages.

```jade
 p
   | #{_("This is how you can use it")}
   span= _("with Jade")
```

## License

MIT © [Damian Krzeminski](https://code42day.com)

[detect-language]: https://npmjs.org/package/detect-language
[overwrite-language]: https://npmjs.org/package/overwrite-language

[npm-image]: https://img.shields.io/npm/v/connect-gettext.svg
[npm-url]: https://npmjs.org/package/connect-gettext

[travis-url]: https://travis-ci.org/code42day/connect-gettext
[travis-image]: https://img.shields.io/travis/code42day/connect-gettext.svg

[gemnasium-image]: https://img.shields.io/gemnasium/code42day/connect-gettext.svg
[gemnasium-url]: https://gemnasium.com/code42day/connect-gettext
