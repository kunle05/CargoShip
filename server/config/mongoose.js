var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DTwinz_db', {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});

var fs = require("fs");
var path = require("path");
var models_path = path.join(__dirname, '../models');

fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    require(models_path + '/' + file);
   }
})

