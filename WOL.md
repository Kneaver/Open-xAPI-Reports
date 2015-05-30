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

npm install -s adl-xapiwrapper

copied app/lib/config.js from "openbadges-badgekit" all settings documentation will not apply to both projects

copied bower.json from KNVStatics (a future open sourced project from Kneaver). A little cleanup in it
copied lib/KNVStatics.js from KNVStatics 

bower update

all libraries are now accessible in the project: bootstrap, jquery, masonry, d3, moment etc..

Completed package.json wich is really the machine readable definition of the project.

added commander for easy command line options

npm install -s commander

added ejs-locals for easy layouts

npm install -s ejs-locals

added Q the promise library because it is a dependency of KNVEJSpages

copied KNVEJSPages the simplied router ala PHP/JSP used in Kneaver

removed routes/users.js no use in this project

created pages folder, moved views/index.ejs in it

renamed app/app.js into app/index.js


