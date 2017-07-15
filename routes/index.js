const express = require('express');
const models = require('../models/models');
const localStorage = require('localStorage');

const User = models.User;
const Gift = models.Gift;
const routes = express();

routes.get('/',(req,res)=> {
  res.render('mainpage');
});

routes.get('/login',(req,res)=> {
  res.render('login');
});

routes.get('/:userId/friendList',(req,res)=> {
  User.findOne({_id:req.params.userId}).populate('friendsList').exec((err,found)=> {
    res.render('wishList',{
      friendList:found.friendsList,
      found:found,
      error:err
    })
  })
});

routes.post('/:userId/addWishList', (req, res) => {
  const userId = req.params.userId;
  const newGift = new Gift({
    imgUrl: req.body.img,
    purchaseUrl: req.body.url,
    name: req.body.name
  })
  newGift.save((err,saved)=>{
    User.findById(userId).exec((err,found)=> {
      const oldList = found.giftList;
      oldList.push(saved._id)
      found.giftList = oldList;
      found.update({giftList:found.giftList}).exec((err,saved)=>{
        res.json({success:true});
      })
    })
  });
})

routes.post('/authenticate', (req,res)=> {
  const facebookid = localStorage.getItem('facebookUser');
  res.json({facebookid:facebookid || ""});
})

routes.get('/:userId/:friendId/wishlists',(req,res)=> {
  const selfId = req.params.userId;
  const friendid = req.params.friendId;
  User.findById(selfId, function (err, foundSelf) {
    console.log("LOGGEDIN USER", foundSelf);
    User.findById(friendid).populate('giftList').exec((err, found)=> {
      res.render('wishList',{
        wishes:found.giftList,
        loggedinUser: foundSelf
      })
    })
  })
})

routes.post('/friendList',(req,res)=> {
  User.findOne({facebookId:req.body.facebookId}).exec((err,found)=> {
    if (found === null) {
      const newUser = new User({
        username: req.body.username,
        facebookId: req.body.facebookId,
      });
      newUser.save((err, newUser)=> {
        res.json({err: err, found: found, mongooseId: newUser._id});
        localStorage.setItem('facebookUser',newUse._id);
        return;
      })
    } else {
      let c = found.friendsList || [];
      let promiseArr = [];
      const mongooseidArr = req.body.friendList.split('/');
      mongooseidArr.forEach(id=> {
        promiseArr.push(User.findOne({facebookId:id}));
      });
      Promise.all(promiseArr)
      .then((data)=> {
        found.friendsList = data.map(friend=>friend._id)
        found.update({friendsList:found.friendsList}).exec((err,saved)=> {
          localStorage.setItem('facebookUser',found._id);
          res.json({err:err,mongooseId:found._id});
          return;
        })
      })
    }
  })
});

module.exports = routes;
