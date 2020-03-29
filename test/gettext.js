describe('connect-gettext node module', function () {
  before(function() {
    this.cwd = process.cwd();
    process.chdir(__dirname);
  });

  after(function() {
    process.chdir(this.cwd);
  });

  it('must inject default translation for default language', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'en'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      const gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Hello');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must support context for the default language', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'en'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      const pgettext = res.locals.pgettext;
      pgettext('formal', 'Hello').should.be.exactly('Hello');
      done(err);
    });
  });

  it('must inject default translation for missing language', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'gr' // no translation files for Greek
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      const gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Hello');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must inject translation for supported language', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function');
      const gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Cześć');
      gettext('Good-bye').should.be.exactly('Do Widzenia');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must honor gettextAlias option', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en',
      gettextAlias: '_'
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('_')
        .with.type('function');
      const gettext = res.locals._;
      gettext('Hello').should.be.exactly('Cześć');
      gettext('Good-bye').should.be.exactly('Do Widzenia');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must honor message context', function (done) {
    const locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en',
    };
    const connectGettext = require('..')(locale);
    const req = {
      lang: 'pl'
    };
    const res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      const gettext = res.locals.gettext;
      const pgettext = res.locals.pgettext;
      gettext('Hello').should.be.exactly('Cześć');
      pgettext('formal', 'Hello').should.be.exactly('Witamy');
      done(err);
    });
  });

});
