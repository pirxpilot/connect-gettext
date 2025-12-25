import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Debug from 'debug';
import gettextParser from 'gettext-parser';

const debug = Debug('connect:gettext');

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
  return Object.keys(obj).reduce((r, key) => {
    const value = mapFn.call(thisArg, obj[key], key);
    if (value !== undefined) {
      r[key] = value;
    }
    return r;
  }, Object.create(null));
}

async function parseLanguage(lang) {
  const poFile = path.join('locale', lang, 'LC_MESSAGES', 'messages.po');
  const po = await readFile(poFile).catch(() => {
    debug('error reading %s - using defaults', poFile);
  });
  if (!po) {
    return;
  }
  const { translations } = gettextParser.po.parse(po);
  return reduceObject(translations, translation =>
    reduceObject(translation, (t, key) => {
      if (key !== '') {
        return t?.msgstr[0];
      }
    })
  );
}

async function initTranslations(languages) {
  const entries = await Promise.all(languages.map(async lang => [lang, await parseLanguage(lang)]));
  return Object.fromEntries(entries);
}

export default function gettext({ supportedLanguages, gettextAlias, pgettextAlias = `p${gettextAlias}` }) {
  const promisedTranslations = initTranslations(supportedLanguages);

  async function selectGettextImplementation(lang) {
    const translation = (await promisedTranslations)[lang];

    if (!translation) {
      // no translation for default language or unssuported languages
      return IDENTITY;
    }
    return {
      gettext: translate.bind(translation, ''),
      pgettext: translate.bind(translation)
    };
  }

  return async ({ lang }, res, next) => {
    const { gettext, pgettext } = await selectGettextImplementation(lang);

    res.locals.lang = lang;
    res.locals.gettext = gettext;
    res.locals.pgettext = pgettext;
    if (gettextAlias) {
      res.locals[gettextAlias] = gettext;
      res.locals[pgettextAlias] = pgettext;
    }
    next();
  };
}
