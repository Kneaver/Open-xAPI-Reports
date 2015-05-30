// KNVEJSPages released here will be open sourced later as an NPM module
var fs = require('fs');
var sys = require('util');
var path = require('path');
var Q = require( 'q');
var debug = require('debug')('ejs');

module.exports = function ( app, options)
{
    var g_options = options || {};
    g_options.dirname = g_options.dirname || __dirname;
  
    return function ( req, response, next) 
    {
        var page = req.path;
        if ( req.path == "/")
        {
              page = "index";
        }
            
        var infile = path.join( g_options.dirname, page + ".ejs");
        if ( !fs.existsSync( infile))
            return next();
        response.setHeader('Content-Type', 'text/html');
        var Extras = {};
        
        //  data is the "this" inside the ejs
        var data =
        {
              "require" : require
            , req : req
            , filename : infile
            , __dirname : path.dirname( infile)
            , "path" : path
            , "response" : response
            , "debugejs" : debug
        };
        // TODO: Multiple Promise
        var Promise = null;
        for (var attr in g_options) {
            if ( g_options.hasOwnProperty(attr)) 
            {
                if ( Q.isPromise( g_options[attr]))
                  if ( g_options[attr].isFulfilled())
                    data[attr] = g_options[attr].inspect().value;
                  else
                    Promise = g_options[attr].then( function( Value) {
                        data[attr] = Value;
                    });
                else
                  data[attr] = g_options[attr];
            }
        }
        for (var attr in Extras) {
            if ( Extras.hasOwnProperty(attr)) 
            {
                if ( Q.isPromiseAlike( Extras[attr]))
                  if ( Extras[attr].isFulfilled())
                    data[attr] = Extras[attr].inspect().value;
                  else
                    Promise = Extras[attr].then( function( Value) {
                        data[attr] = Value;
                    });
                else
                {
                  data[attr] = Extras[attr];
                }
            }
        }
        var optionsRender = 
        {
            locals: 
            {
                _layoutFile: false 
            }
        };
        if ( Promise)
          Promise.then( function() {
            response.render( g_options.dirname + "/" + page.replace( "/",""), data);
          });
        else
          response.render( g_options.dirname + "/" + page.replace( "/",""), data);
    }
}

