import { before, describe, it } from 'node:test';
import gettext from '../lib/gettext.js';

describe('connect-gettext node module', () => {
  before(() => process.chdir(import.meta.dirname));

  it('must inject default translation for default language', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'en'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      t.assert.equal(typeof res.locals.gettext, 'function');
      t.assert.equal(res.locals.gettext.name, 'identity');
      const { gettext } = res.locals;
      t.assert.equal(gettext('Hello'), 'Hello');
      t.assert.equal(gettext('Some other string'), 'Some other string');
      done(err);
    });
  });

  it('must support context for the default language', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'en'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      t.assert.equal(typeof res.locals.pgettext, 'function');
      t.assert.equal(res.locals.pgettext.name, 'pidentity');
      const { pgettext } = res.locals;
      t.assert.equal(pgettext('formal', 'Hello'), 'Hello');
      done(err);
    });
  });

  it('must inject default translation for missing language', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'gr' // no translation files for Greek
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      t.assert.equal(typeof res.locals.gettext, 'function');
      t.assert.equal(res.locals.gettext.name, 'identity');
      const { gettext } = res.locals;
      t.assert.equal(gettext('Hello'), 'Hello');
      t.assert.equal(gettext('Some other string'), 'Some other string');
      done(err);
    });
  });

  it('must inject translation for supported language', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      t.assert.equal(typeof res.locals.gettext, 'function');
      const { gettext } = res.locals;
      t.assert.equal(gettext('Hello'), 'Cześć');
      t.assert.equal(gettext('Good-bye'), 'Do Widzenia');
      t.assert.equal(gettext('Some other string'), 'Some other string');
      done(err);
    });
  });

  it('must honor gettextAlias option', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en',
      gettextAlias: '_'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      t.assert.equal(typeof res.locals._, 'function');
      const gettext = res.locals._;
      t.assert.equal(gettext('Hello'), 'Cześć');
      t.assert.equal(gettext('Good-bye'), 'Do Widzenia');
      t.assert.equal(gettext('Some other string'), 'Some other string');
      done(err);
    });
  });

  it('must honor message context', (t, done) => {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = gettext(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, err => {
      const { gettext, pgettext } = res.locals;
      t.assert.equal(gettext('Hello'), 'Cześć');
      t.assert.equal(pgettext('formal', 'Hello'), 'Witamy');
      done(err);
    });
  });
});
