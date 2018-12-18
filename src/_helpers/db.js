const config = require('./../../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

module.exports = {
    User: require('../models/usuario'),
    TipoUser: require('../models/tipousuario')
};