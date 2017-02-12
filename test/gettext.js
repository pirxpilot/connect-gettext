describe('connect-gettext node module', function () {
  before(function() {
    this.cwd = process.cwd();
    process.chdir(__dirname);
  });

  after(function() {
    process.chdir(this.cwd);
  });

  it('must inject default translation for default language', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'en'
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      var gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Hello');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must support context for the default language', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'en'
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      var gettext = res.locals.gettext;
      gettext.p('formal', 'Hello').should.be.exactly('Hello');
      done(err);
    });
  });

  it('must inject default translation for missing language', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'gr' // no translation files for Greek
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function').property('name', 'identity');
      var gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Hello');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must inject translation for supported language', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en'
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'pl'
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('gettext')
        .with.type('function');
      var gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Cześć');
      gettext('Good-bye').should.be.exactly('Do Widzenia');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must honor gettextAlias option', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en',
      gettextAlias: '_'
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'pl'
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      res.locals.should.have.property('_')
        .with.type('function');
      var gettext = res.locals._;
      gettext('Hello').should.be.exactly('Cześć');
      gettext('Good-bye').should.be.exactly('Do Widzenia');
      gettext('Some other string').should.be.exactly('Some other string');
      done(err);
    });
  });

  it('must honor message context', function (done) {
    var locale = {
      supportedLanguages: ['pl'],
      defaultLanguage: 'en',
    };
    var connectGettext = require('..')(locale);
    var req = {
      lang: 'pl'
    };
    var res = {
      locals: {}
    };

    connectGettext(req, res, function(err) {
      var gettext = res.locals.gettext;
      gettext('Hello').should.be.exactly('Cześć');
      gettext.p('formal', 'Hello').should.be.exactly('Witamy');
      done(err);
    });
  });


});
