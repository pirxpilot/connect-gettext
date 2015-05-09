var fs = require('fs');
var path = require('path');
var gettextParser = require('gettext-parser');
var debug = require('debug')('connect:gettext');

// insert proper gettext implementation into res.locals

function identity(s) {
  return s;
}

function translate(s) {
  var context = this;
  return context.messages[s] || s;
}

function parseLanguage(lang) {
  var poFile = path.join('locale', lang, 'LC_MESSAGES', 'messages.po');
  if (!fs.existsSync(poFile)) {
    debug('%s missing - using defaults', poFile);
    return;
  }
  var po = fs.readFileSync(poFile);
  var messages = gettextParser.po.parse(po);
  // only support default context
  messages = messages.translations[''];
  // only support a default (singular) translation
  return Object.keys(messages).reduce(function(translations, s) {
    var t = messages[s];
    t = t && t.msgstr[0];
    if (t) {
      translations[s] = t;
    }
    return translations;
  }, Object.create(null));
}

function initTranslations(languages) {
  return languages.reduce(function(tr, lang) {
    tr[lang] = parseLanguage(lang);
    return tr;
  }, Object.create(null));
}

module.exports = function(options) {
  var translations = initTranslations(options.supportedLanguages);

  function selectGettextImplementation(lang) {
    var messages = translations[lang];
    if(!messages) {
      // no translation for default language or unssuported languages
      return identity;
    }
    return translate.bind({
      messages: messages
    });
  }

  return function(req, res, next) {
    var gettext = selectGettextImplementation(req.lang);

    res.locals.lang = req.lang;
    res.locals.gettext = gettext;
    if (options.gettextAlias) {
      res.locals[options.gettextAlias] = gettext;
    }
    next();
  };
};
