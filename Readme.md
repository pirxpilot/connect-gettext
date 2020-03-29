[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

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

MIT © [Damian Krzeminski](https://pirxpilot.me)

[detect-language]: https://npmjs.org/package/detect-language
[overwrite-language]: https://npmjs.org/package/overwrite-language

[npm-image]: https://img.shields.io/npm/v/connect-gettext.svg
[npm-url]: https://npmjs.org/package/connect-gettext

[travis-url]: https://travis-ci.org/pirxpilot/connect-gettext
[travis-image]: https://img.shields.io/travis/pirxpilot/connect-gettext.svg

[deps-image]: https://img.shields.io/david/pirxpilot/connect-gettext.svg
[deps-url]: https://david-dm.org/pirxpilot/connect-gettext

[deps-dev-image]: https://img.shields.io/david/dev/pirxpilot/connect-gettext.svg
[deps-dev-url]: https://david-dm.org/pirxpilot/connect-gettext?type=dev
