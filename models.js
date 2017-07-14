const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  facebookId: String,
  friendsList: [{
    type: ObjectId,
    ref: 'User' }]
});

const giftSchema = mongoose.Schema({
  imgUrl: String,
  purchaseUrl: String
})

const wishlistSchema = mongoose.Schema({
  gifts: [{
    type: ObjectId,
    ref: 'Gift'
  }]
})

const User = mongoose.model('User', userSchema);
const Gift = mongoose.model('Gift', giftSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);


module.exports = {
    User: User,
    Gift: Gift,
    Wishlist: Wishlist
};
