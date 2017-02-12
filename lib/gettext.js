var fs = require('fs');
var path = require('path');
var gettextParser = require('gettext-parser');
var debug = require('debug')('connect:gettext');

// insert proper gettext implementation into res.locals

function identity(s) {
  return s;
}

function pidentity(msgctx, s) {
  return s;
}

identity.p = pidentity;

function translate(msgctx, msgid) {
  var messages = this[msgctx];
  return messages && messages[msgid] || msgid;
}

function reduceObject(obj, mapFn, thisArg) {
  return Object.keys(obj).reduce(function(r, key) {
    var value = mapFn.call(thisArg, obj[key], key);
    if (value !== undefined) {
      r[key] = value;
    }
    return r;
  }, Object.create(null));
}

function parseLanguage(lang) {
  var poFile = path.join('locale', lang, 'LC_MESSAGES', 'messages.po');
  if (!fs.existsSync(poFile)) {
    debug('%s missing - using defaults', poFile);
    return;
  }
  var po = fs.readFileSync(poFile);
  var messages = gettextParser.po.parse(po);
  return reduceObject(messages.translations, function(translation) {
    return reduceObject(translation, function(t, key) {
      if (key === '') {
        return;
      }
      return t && t.msgstr[0];
    });
  });
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
    var translation = translations[lang];

    if(!translation) {
      // no translation for default language or unssuported languages
      return identity;
    }
    var gettext = translate.bind(translation, '');
    gettext.p = translate.bind(translation);
    return gettext;
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
