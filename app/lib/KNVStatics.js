// KNVStatics released here will be open sourced later as an NPM module
var path = require('path');
var fs = require('fs');

// bower zone, open source software from various authors, check manifests in each directories fo rights and licences
var Statics = [
    [ "/assets" , path.join( __dirname, 'bower_components/bootstrap/dist')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/jquery/dist')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/jquery-migrate')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/underscore')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/backbone/backbone.js')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/livestampjs')],
    [ "/assets/js" , path.join( __dirname, 'bower_components/moment')],
    [ "/assets/js/moment.twitter", path.join( __dirname, 'bower_components/moment.twitter')],
    [ "/assets", path.join( __dirname, 'bower_components/Font-Awesome')],
    [ "/assets/css", path.join( __dirname, 'bower_components/jqueryui/themes/start')],
    [ "/assets/js", path.join( __dirname, 'bower_components/jqueryui')],
    [ "/assets/js", path.join( __dirname, 'bower_components/jqueryui/ui')],
    [ "/assets/js", path.join( __dirname, 'bower_components/jquery.cookie')],
    // RSChange(1227,BW,2014.11.30,"November Week 4 Update")
    [ "/assets/js", path.join( __dirname, 'bower_components/jquery.hotkeys'), ['jquery.hotkeys.js']],
    [ "/assets/js", path.join( __dirname, 'bower_components/Stupid-Table-Plugin'), ['stupidtable.js']],
    // RSChangeEnd(1227)
    [ "/assets/js", path.join( __dirname, 'bower_components/jstree/dist')],
    // RSChange(1220,BW,2014.06.02,"Install Typeahead")
    [ "/assets/js", path.join( __dirname, 'bower_components/typeahead.js/dist')],
    // RSChangeEnd(1220)
    [ "/assets/js", path.join( __dirname, 'bower_components/d3')],
    [ "/assets/js", path.join( __dirname, 'bower_components/xcharts-build.tar')],
    [ "/assets/css", path.join( __dirname, 'bower_components/xcharts-build.tar')],
    [ "/assets/tinymce", path.join( __dirname, 'bower_components/tinymce')],
    [ "/assets", path.join( __dirname, 'bower_components/hopscotch/dist')],
    [ "/assets/js", path.join( __dirname, 'bower_components/masonry/dist')],
    [ "/assets/js", path.join( __dirname, 'bower_components/imagesloaded')],
    [ "/assets/js", path.join( __dirname, 'bower_components/bootstrap-tagsinput/dist')],
    [ "/assets/css", path.join( __dirname, 'bower_components/bootstrap-tagsinput/dist')],
    [ "/assets/js/angular.js", path.join( __dirname, 'bower_components/angular/angular.js')],
    [ "/assets/css", path.join( __dirname, 'bower_components/prettyphoto/css')],
    [ "/assets/img", path.join( __dirname, 'bower_components/prettyphoto/images')],
    [ "/assets/js", path.join( __dirname, 'bower_components/prettyphoto/js'), [ 'jquery.prettyPhoto.js']],
    [ "/assets/js", path.join( __dirname, 'bower_components/jquery.easing.1.3')],
    [ "/assets/js", path.join( __dirname, 'bower_components/FitVids')],
    [ "/assets/js", path.join( __dirname, 'bower_components/jquery.gmap'), [ 'jquery.gmap.js']],
    [ "/assets/js", path.join( __dirname, 'bower_components/jquery.inview')],
    [ "/assets/js", path.join( __dirname, 'bower_components/respond/dest')],
    [ "/assets/js", path.join( __dirname, 'bower_components/modernizr'), [ 'modernizr.js']],    
    [ "/assets/js", path.join( __dirname, 'bower_components/waitForImages/dist')],
    [ "/assets/css", path.join( __dirname, 'bower_components/bootstrap-social-buttons')],
    [ "/assets", path.join( __dirname, 'bower_components/jquery-sortable/source')],
    // <!-- Unfortunately, jQuery File Upload Plugin has a few more dependencies itself -->
    [ "/assets", path.join( __dirname, 'bower_components/blueimp-file-upload')]

];

if (require.main == module) {
}
else
{
    module.exports = function( app, __RSRDIR__, express)
    {
        var Dir = Statics;
        for ( var i = 0; i < Dir.length; i++)
        {
            var Elt = Dir[ i];
            app.use( Elt[0], express.static( Elt[ 1], { maxAge: 1000*60*100} ));
        }
    };
}