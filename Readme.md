[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

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

[npm-image]: https://img.shields.io/npm/v/connect-gettext
[npm-url]: https://npmjs.org/package/connect-gettext

[build-url]: https://github.com/pirxpilot/connect-gettext/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/connect-gettext/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/connect-gettext
[deps-url]: https://libraries.io/npm/connect-gettext

