#! /usr/bin/env node

console.log('This script populates some fun items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
const Item = require('./models/item');
const Category = require('./models/category');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []


function authorCreate(name, description, category, price, stock, cb) {
  itemDetail = {name, description, category, price, stock }

  
  var item = new Item(itemDetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}



function bookCreate(name, description, cb) {
  categorydetail = { 
    name: name,
    description: description,
  }
  
    
  var category = new Category(categorydetail);    
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}




function createGenreAuthors(cb) {
    async.series([
        function(callback) {
          authorCreate('Chicken Fingers', 'Tasty', 'food', 5, 3, callback);
        },
        function(callback) {
          authorCreate('Beans', 'Just some beans', 'food', 3, 10, callback);
        },
        function(callback) {
          authorCreate('Refried Beans', 'Beans but refried', 'food', 6, 6, callback);
        },
        function(callback) {
          authorCreate('Rusted Cast Iron Skillet', 'Could use a cleaning', 'cookware', 25, 1, callback);
        },
        function(callback) {
          authorCreate('Stick with String Attached', 'Fishing pole?', 'tools', 158, 300, callback);
        },
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('food', 'Food stuffs', callback);
        },
        function(callback) {
          bookCreate("cookware", 'This stuff can cook!', callback);
        },
        function(callback) {
          bookCreate("tools", 'This can be used for something... probably', callback);
        },
    ],
        // optional callback
        cb);
}







async.series([
    createGenreAuthors,
    createBooks,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



