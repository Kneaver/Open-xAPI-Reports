2015-05-30 Saturday

Started this project yesterday night while chatting with Jessie Chuang on the choice of reporting options for xAPI
Woke up this morning with this idea to do it WOL

NodeJS is installed ( https://nodejs.org/ )

Express also ( http://expressjs.com/, type "npm install -g express" to install it )

bower installed ( type "npm install -g bower" to install it)

mkdir Open-xAPI-Reports

cd Open-xAPI-Reporting

I wish to aligne the directory structure with openbadges-badgekit to reduce cost of ownership. So verything will go in an app subdirectory 

mkdir app

cd app

express --ejs --css less

   create : .
   create : ./package.json
   create : ./app.js
   create : ./public
   create : ./routes
   create : ./routes/index.js
   create : ./routes/users.js
   create : ./public/javascripts
   create : ./public/images
   create : ./bin
   create : ./bin/www
   create : ./public/stylesheets
   create : ./public/stylesheets/style.less
   create : ./views
   create : ./views/index.ejs
   create : ./views/error.ejs

   install dependencies:
     $ cd . && npm install

   run the app:
     $ DEBUG=my-application ./bin/www

run 
npm install 
to make sure all dependencies are available

mv package.json ..
mv node_modules ..

cd ..

Add xAPI access library

npm install -save adl-xapiwrapper

copied app/lib/config.js from "openbadges-badgekit" all settings documentation will not apply to both projects

copied bower.json from KNVStatics (a future open sourced project from Kneaver). A little cleanup in it
copied lib/KNVStatics.js from KNVStatics 

bower update

all libraries are now accessible in the project: bootstrap, jquery, masonry, d3, moment etc..

Completed package.json wich is really the machine readable definition of the project.

added commander for easy command line options

npm install -save commander

added ejs-locals for easy layouts

npm install -save ejs-locals

added Q the promise library because it is a dependency of KNVEJSpages

npm install -save q

copied KNVEJSPages the simplied router ala PHP/JSP used in Kneaver

removed routes/users.js no use in this project

created pages folder, moved views/index.ejs in it

renamed app/app.js into app/index.js

changes in app.js indicated by "Step 1"

- commander and command line arguments for LRS connection
- first page index.js for /

first page showing up

node app
Open-xAPI-Reports listening on port 3000
GET / 200 16ms - 237b
GET /stylesheets/style.css 200 44ms - 110b

prepare for pushing to github:

git init
git remote add origin https://github.com/Kneaver/Open-xAPI-Reports.git

First commit ...

----

Step 2

Connect to an LRS

I will use http://demo.learninglocker.net/ kindly offered by ht2 for the duration of #LearnxAPI

So I created a file config.json as follow

{
    "LRSEndPoint" : "http://demo.learninglocker.net/data/xAPI/",
    "LRSUser" : "d416e6220812740d3922eb09813ebb4163e8eb3e",
    "LRSPwd" : "bc7e0a2edd5d1969b6d774e679d4eb4e7a35be13"
}

and I install the adl wrapper as documented on https://github.com/adlnet/xapiwrapper-node
and fetch the first statements
that I save in GlobalData.Statements

It works, although not very nice. let's put it in comments

Now I modify the entry page

    <% if ( Statements) { %>
    We have statements!
        <%= JSON.stringify( Statements) %>
    <% } %>
ejs files are basically HTML5 with code injection. Plain code is injected using <% %>, pure html is output using <%- expression %> and text <%= %>

we are done for Step 2, Step 3 will be a nicer display

---

Step 3 nicer table display of statements

we deal basically with pages/index.ejs
but first we will install a layout page to have all pages with a common setup

I'm copying the views/layout.ejs from chatdir.kneaver.comm 
Nothing very smart, just boilerplate bootstrap code
And I replace "Kneaver" with <%=AppName%>

then in pages/index.js I simplify a lot by removing all the boilerplate HTML
OK suddenly the apparence becomes much more interesting. We gained a top menu, responsive design, fonts, icons etc..

Since we are in such a good way let's add the libraries for charting to layout.ejs

<link rel="stylesheet" href="/assets/css/xcharts.css" />
<script src="/assets/js/d3.min.js"></script>
<script src="/assets/js/xcharts.js"></script>

This will be to display raw statements
  <pre><code><%= JSON.stringify( Statements) %></code></pre>

We add a fct syntaxHighlight to beautify JSON text and statements in particular
and we add to layout.ejs some styles to have a nicer display of statements

<style>
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; text-align:left; }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>

so this the better way to have a nice display
  <pre><code><%- syntaxHighlight( Statements) %></code></pre>

we can do much better by using tables

First let's do a for loop in statements

<% for (i = 0; i < Statements.length; i++) { 
     Statement = Statements[ i];
%>
  <pre><code><%- syntaxHighlight( Statement) %></code></pre>
<% } %>

this will display each statement on its own

Next we use an HTML table, with oe column and one row per statement

<table>
<thead>
<td>
Statement
</td>
</thead>
<% for (i = 0; i < Statements.length; i++) { 
     Statement = Statements[ i];
%>
<tr>
<td>
  <pre><code><%- syntaxHighlight( Statement) %></code></pre>
</td>
</tr>
<% } %>
</table>

Next step we split statements in columns

Step 4 break into statements

Basically a statement as the following parts, let's break them in columns. 

    "timestamp": "2015-05-30T14:09:30+0000",
    
    Use it as date, use moment.js for nicer display
    
    "actor": {
        "objectType": "Agent",
        "name": "XXXXXXXXX",
        "account": {
            "name": "c0916254-0314-4800-a603-8bac1c66f18a",
            "homePage": "http://beta.curatr3.com"
        }
    },
    
    For actor we will display actor.name
    
    "verb": {
        "id": "http://adlnet.gov/expapi/verbs/commented",
        "display": {
            "en-US": "commented",
            "en-GB": "commented"
        }
    },
    For verb we will display verb.display[ "en-US"]

    "object": {
        "objectType": "Activity",
        "id": "http://beta.curatr3.com/courses/xapi/home#object/11939/comment/58983",
        "definition": {
            "type": "http://activitystrea.ms/schema/1.0/comment",
            "name": {
                "en-US": "comment to xAPI in the Real World",
                "en-GB": "comment to xAPI in the Real World"
            }
        }
    },
    For object we will display object.definition.name[ "en-US"]
    
    "result": {
        "response": "These examples ...."
    },

"context": can be very interesting but also will vary a lot and it long to display
    
but also attributes technically important but less usefull for reporting
"version": "1.0.0",
"authority": {
    "stored": "2015-05-30T14:09:32.332400+00:00",
    "id": "5fa33eff-58d5-412d-a3b9-f76c223c855d"
}

we got

<table>
<thead>
<td>
Timestamp
</td>
<td>
Name
</td>
<td>
Verb
</td>
<td>
Object
</td>
<td>
Context
</td>
</thead>
<% for (i = 0; i < Statements.length; i++) { 
     var Statement = Statements[ i];
%>
<tr>
<td><%=Statement.timestamp%></td>
<td><%=Statement.actor.name%></td>
<td><%=Statement.verb.display[ "en-US"]%></td>
<td><%-Statement.object.definition.name[ "en-US"]%></td>
<td>
  <pre><code><%- syntaxHighlight( Statement.context) %></code></pre>
</td>
</tr>
<% } %>
</table>
    
The problem is that it breaks! Why? because xAPI don't make locale strings compulsory. So to find a significant display we need to trick.

let's use the trick below on object and see how to fix it in Step 5
     var ActivityName = Statement.object.definition.name?Statement.object.definition.name[ "en-US"]:syntaxHighlight( Statement.object.definition);

<td><%-ActivityName%></td>

---

Step 5 better extraction of Statement data

While xAPI statement follow a certain formalism for assuring a certain level of durability and consistency most reporting apps will be concerned to display meaningful information. How to find a get predictable and uniform data ? Honestly I don't know. I go as far as thinking that xAPI is not yet fully mature on this point. This is the reason th amotivate my to accept the invitation I received to join the xAPI vocabulary group. 

Now here we at coding level and common practice consist in encapsulating what causes us to think to much, what is likely to change often in centralized functions. 

Don't be afraid to give long names to functions. It makes clear once for all what they achieve and increase readibility of sources.

function GetDisplayLabelFromVerb( verb);
function GetDisplayLabelFromActivity( activity);
function GetDisplayLabelFromActor( actor);

No need to pass the complete statement since *normally* each constituent is uniquely defined by its record. 

Similarly we will need to extract a string used as identifier when we will aggregate results. This string is for computing only and we don't even need to know what is in it.

function GetIdFromVerb( verb);
function GetIdFromActivity( activity);
function GetIdFromActor( actor);

All the functions will be placed in a new module in lib/xAPIAdapter.js and passed to pages via the GlobalData object.

To export functions from the module it's sufficient to assign them to exports.
To get a module into another we use 'require'.

In javascript functions are objects like others. 

between two equivalent syntax the second is easier to maintain although it can appear as disconcerting at first view

A) Old style
// create a function in module space
function GetIdFromActor( actor)
{
}

// export it
exports.GetIdFromActor = GetIdFromActor;

B) Modern style
// create a function directly in exports
exports.GetIdFromActor = function( actor)
{
}

see compete code in lib/xAPIAdapter.js

I commented the column context wchih can be voluminous and not very self explainable

It doesn't look great yet but this is for Step 6

---

Step 6 : adding style and interactivity to the table

we add classes for bootstrap styles and stupidtable plugins

<table  class="table table-striped tablesorter stupidtable" id="Report1">

Time descending
    <td data-sort-default="desc">

Use KNVDateFct for Statement.timestamp display

Call Moment on dates
    jQuery(function () {
        jQuery("time[data-format]").each(function () {
            var el = jQuery(this);
            var val = el.attr("datetime");
            var format = el.data("format");
            var d = new Date( val);
            if ( format == "DocWriteLocalDateDayOnly")
                el.html( DocWriteLocalDateDayOnly(d) );
            else
            if ( format == "DocWriteLocalDate")
                el.html( DocWriteLocalDateDayOnly( d) + DocWriteLocalHourInDay( d) );
            else
            {
                var dt = moment( val);
                el.html(dt.format( format));
            }
        });
    });

Added app/public/js/KNVDateFct.js will be open sourced later on its own
this module will be used server side or client side
Tests

1. Don't understand with stupidtable don't work
I used td for thead cells, instead of th, replacing with th now

2. No, only I forgot also to add the data-sort="int" to each th
OK now it works, we can sort the table

3. date still not working properly. Forgot data-format="" 

renamed public/javascripts into public/js
renamed public/stylesheets into public/css

OK dates now properly displayed: "Today  8:22 PM, 32 minutes ago"

OK title properly displayed

Now first deployement on http://xapi-reports.kneaver.com/ 