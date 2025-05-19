const fs = require('node:fs');
const path = require('node:path');
const gettextParser = require('gettext-parser');
const debug = require('debug')('connect:gettext');

// insert proper gettext implementation into res.locals

const IDENTITY = {
  gettext: function identity(msgid) {
    return msgid;
  },
  pgettext: function pidentity(_msgctx, msgid) {
    return msgid;
  }
};

function translate(msgctx, msgid) {
  const messages = this[msgctx];
  return messages?.[msgid] || msgid;
}

function reduceObject(obj, mapFn, thisArg) {
  return Object.keys(obj).reduce(function (r, key) {
    const value = mapFn.call(thisArg, obj[key], key);
    if (value !== undefined) {
      r[key] = value;
    }
    return r;
  }, Object.create(null));
}

function parseLanguage(lang) {
  const poFile = path.join('locale', lang, 'LC_MESSAGES', 'messages.po');
  if (!fs.existsSync(poFile)) {
    debug('%s missing - using defaults', poFile);
    return;
  }
  const po = fs.readFileSync(poFile);
  const messages = gettextParser.po.parse(po);
  return reduceObject(messages.translations, function (translation) {
    return reduceObject(translation, function (t, key) {
      if (key === '') {
        return;
      }
      return t?.msgstr[0];
    });
  });
}

function initTranslations(languages) {
  return languages.reduce(function (tr, lang) {
    tr[lang] = parseLanguage(lang);
    return tr;
  }, Object.create(null));
}

module.exports = function (options) {
  const translations = initTranslations(options.supportedLanguages);

  const gettextAlias = options?.gettextAlias;
  let pgettextAlias = options?.pgettextAlias;

  if (gettextAlias && !pgettextAlias) {
    pgettextAlias = `p${gettextAlias}`;
  }

  function selectGettextImplementation(lang) {
    const translation = translations[lang];

    if (!translation) {
      // no translation for default language or unssuported languages
      return IDENTITY;
    }
    return {
      gettext: translate.bind(translation, ''),
      pgettext: translate.bind(translation)
    };
  }

  return function (req, res, next) {
    const implementation = selectGettextImplementation(req.lang);

    res.locals.lang = req.lang;
    res.locals.gettext = implementation.gettext;
    res.locals.pgettext = implementation.pgettext;
    if (gettextAlias) {
      res.locals[gettextAlias] = implementation.gettext;
      res.locals[pgettextAlias] = implementation.pgettext;
    }
    next();
  };
};
