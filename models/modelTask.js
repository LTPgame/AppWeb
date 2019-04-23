var mongoose = require('mongoose');

// Define the home page route
mongoose.connect('mongodb+srv://user1:mdpuser1@cluster0-t4qee.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
//mongodb://localhost/ListeaFaire
var Tache = mongoose.model('Tache', new mongoose.Schema({
    _id: String,
    text : String,
    username : String,
    done:Boolean
})
);

module.exports = Tache;

