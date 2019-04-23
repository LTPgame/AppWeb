var mongoose = require('mongoose');

// Define the home page route
mongoose.connect('mongodb+srv://user1:mdpuser1@cluster0-t4qee.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
//mongodb://localhost/ListeaFaire
var Liste = mongoose.model('List', new mongoose.Schema({
    nom: {type: String, unique: true},
    username : String,
    listTask: Array
})
);

module.exports = Liste;

