const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  facebookId: String,
  giftList:[{
    type: mongoose.Schema.ObjectId,
    ref: 'Gift'
  }],
  friendsList: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User' }]
});

const giftSchema = mongoose.Schema({
  imgUrl: String,
  purchaseUrl: String,
  name: String
})

const User = mongoose.model('User', userSchema);
const Gift = mongoose.model('Gift', giftSchema);

module.exports = {
    User,
    Gift
};
