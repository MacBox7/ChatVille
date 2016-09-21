var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
      user: String,
      message: String
});
module.exports = mongoose.model('Chat',chatSchema);
