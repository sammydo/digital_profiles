var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      required: true
    },
    profile: {
      type: Object,
      required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
