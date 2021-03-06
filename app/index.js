// general modules
var path = require('path');
// Step 1
var commander = require('commander');
const package = require('../package')
const config = require('./lib/config');
// End Step 1

// HTTP Server modules
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// not used var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Step 1
var statics = require( './lib/KNVStatics');
statics( app, __dirname, express);
    
// For sessions
// ? app.use( sioCookieParser);
if (false)
app.use( session(
{ 
  // secret already set, must be same as socket.io, sioCookieParser
  secret: "no so secret now"
  // must be shared with socket.io key: 'sid',
  , saveUninitialized : true
  , resave : true
}));
    
app.use( favicon( path.join( __dirname, 'client/ico/favicon.ico')));

var ejsLocals = require("ejs-locals");
app.set( 'views', path.join( __dirname, 'views'));
app.set( 'view engine', 'ejs');
app.engine( 'ejs', ejsLocals);

// Step 3
function syntaxHighlight( statement) {
  var json = JSON.stringify( statement, undefined, 4);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
	  if (/:$/.test(match)) {
	      cls = 'key';
	  } else {
	      cls = 'string';
	  }
      } else if (/true|false/.test(match)) {
	  cls = 'boolean';
      } else if (/null/.test(match)) {
	  cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
  // http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
  var urlpattern = /((http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/g
//  var urlpattern = /(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/g;
  json = json.replace( urlpattern, function (str, group1) 
	{
//		var url = URLRelocate(group1);
		var url = group1;
		return '<a href="' + url + '">' + group1 + '</a>';
	});
  return json;
}
// End Step 3

// Step 5
var xAPIAdapter = require( './lib/xAPIAdapter');
// End Step 5

// Step 2
var GlobalData =   {
    "dirname" : path.join( __dirname, "pages"),
    "AppName" : package.name,
    "title" : package.name,
    // Step 5
    "xAPIAdapter" : xAPIAdapter,
    // End Step 5
    // Step 6
    "KNVDateFct" : require( "./public/js/KNVDateFct"),
    // End Step 6
    // Step 3
    "syntaxHighlight" : syntaxHighlight
    
    // End Step 3
  };
// End Step 2

// EJSPages are after routes
var EJSPages = require( './lib/KNVEJSPages');
app.use( EJSPages( app, GlobalData
));
// End Step1

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Step 1
if (require.main == module) {
  // Attribute is name of option
  // http://visionmedia.github.io/commander.js/
  commander
      .option( '--lrs-endpoint <serverName>', 'ServerName')
      .option( '--lrs-user <serverName>', 'ServerName')
      .option( '--lrs-pwd <serverName>', 'ServerName')
      .option( '--port <serverName>', 'ServerName')
      .option( '--debug', 'ServerName')
      .parse( process.argv);
  try
  {
    // This fragment from openbadges-badgekit
    var newrelic;
    if (process.env.NEW_RELIC_ENABLED) {
      newrelic = require('newrelic');
    }
    else {
      newrelic = {
        getBrowserTimingHeader: function () {
          return "<!-- New Relic RUM disabled -->";
        }
      };
    }
    const port = commander.port || config( 'PORT', 3000);

    // Step 2
    GlobalData.LRSEndPoint = commander.lrsEndpoint || config( 'LRSEndPoint', "nope");
    GlobalData.LRSUser = commander.lrsUser || config( 'LRSUser', "");
    GlobalData.LRSPwd = commander.lrsPwd || config( 'LRSPwd', "");
    
    // as documented on https://github.com/adlnet/xapiwrapper-node
    var adl = require('adl-xapiwrapper');
    var opts = {
        "url": GlobalData.LRSEndPoint,
        "auth":{
            "user": GlobalData.LRSUser,
            "pass": GlobalData.LRSPwd
        },
    };
    var mylrs = new adl.XAPIWrapper(opts);
    GlobalData.xAPI = mylrs;
    GlobalData.xAPI.getStatements(null, null, function(err, resp, bdy) {
        GlobalData.Statements = JSON.parse(bdy).statements;
        console.log(resp.statusCode);
        // console.log( GlobalData.Statements);
    });
    // End Step 2

    app.listen(port, function(err) {
      if (err) {
        throw err;
      }

      console.log('%s listening on port %s', package.name, port);
    });
  }
  catch ( err)
  {
      console.log( err);
  }
}
else
// End Step 1
{
  // use this app as a component
  module.exports = app;
}
