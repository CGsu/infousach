const config = require('./../../config.json');
const mongoose = require('mongoose');
const URI = "mongodb://localhost:27017/infousach"

mongoose.connect(URI, { useNewUrlParser: true } )
	.then(db => console.log("Database is connected on ", URI))
	.catch(err => console.log(err));

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
