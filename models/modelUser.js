var mongoose = require('mongoose');

// Define the home page route
mongoose.connect('mongodb+srv://user1:mdpuser1@cluster0-t4qee.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

var User = mongoose.model('User', new mongoose.Schema({
    username: {type:String,unique:true},
    mdp: String
})
);

module.exports = User;