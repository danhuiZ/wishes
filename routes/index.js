const express = require('express');
const models = require('../models/models');
// const localStorage = require('localStorage');

const User = models.User;
const Gift = models.Gift;
const routes = express();

routes.get('/',(req,res)=> {
  res.render('mainpage');
});

routes.get('/login',(req,res)=> {
  res.render('login');
});

routes.get('/logout',(req,res)=> {
  console.log("before logout");
  console.log(req.cookies.facebookId);
  res.clearCookie('facebookId',{domain:'.ronchon-croissant-34901.herokuapp.com'});
  console.log("after");
  res.render('logout');
});

routes.get('/mostpopular',(req,res)=> {
  res.render('mostpopular');
});

routes.get('/:userId/delete/:giftid',(req,res)=> {
  Gift.findById(req.params.giftid).remove().exec((err,removed)=> {
    User.findById(req.params.userId).exec((err,foundUser)=> {
      const giftArr = foundUser.giftList.filter(a=> {
        return a.toString() !== req.params.giftid;
      });
      foundUser.giftList = giftArr;
      foundUser.update({giftList:foundUser.giftList}).exec((err,updated)=> {
        res.redirect('/'+req.params.userId+'/friendList');
      })
    })
  });
});

routes.get('/:userId/friendList',(req,res)=> {
  User.findOne({_id:req.params.userId}).populate('friendsList').populate('giftList').exec((err,found)=> {
    if (found) {
      res.render('wishList',{
        friendList: found.friendsList,
        found: found,
        error: err,
        wishes: found.giftList.reverse(),
        selfPage:true,
        userId:req.params.userId
      })
    } else {
      res.send("userid not found")
    }
  })
});

routes.get('/:userId/:friendId/wishlists', (req,res)=> {
  const selfId = req.params.userId;
  const friendid = req.params.friendId;
  User.findById(selfId).populate('friendsList').exec((err, foundSelf)=> {
    // console.log("LOGGEDIN USER", foundSelf);
    User.findById(friendid).populate('giftList').exec((err, foundFriend)=> {
      res.render('wishList',{
        wishes: foundFriend.giftList.reverse(),
        found: foundSelf,
        friend: foundFriend,
        friendList: foundSelf.friendsList,
        selfPage: false,
        friendId: friendid
      })
    })
  })
})

routes.get('/:wishid/adopt', (req,res)=> {
  const userid = req.cookies.facebookId;
  const giftid = req.params.wishid;
  Gift.findById(giftid).exec((err,found)=> {
    found.adopted = true;
    found.update({adopted:found.adopted}).exec((err,updated)=>{
      User.findOne({facebookId:userid}).exec((err,foundUser)=> {
        if (foundUser) {
          res.redirect('/'+foundUser._id +'/friendList');
        }
      })
    })
  })
})

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
  const facebookid = req.cookies.facebookId;
  User.findOne({facebookId:facebookid}).populate('friendsList').exec((err,saved)=> {
    if (saved) {
      const allPromise = [];
      urlString = "";
      saved.friendsList.forEach(id=> {
        allPromise.push(User.findById(id).populate('giftList'));
      });
      Promise.all(allPromise)
      .then(data=> {
        const urlArr = data.map(obj=>obj.giftList.map(i=>i.purchaseUrl)).reduce(function(a,b) {
          return [...a,...b];
        },[]);
        res.json({facebookid:saved._id, name: saved.username, urls:urlArr});
      })
    } else {
      res.json({facebookid:"", name:""})
    }
  })
});

routes.post('/friendList',(req,res)=> {
  User.findOne({facebookId:req.body.facebookId}).exec((err,found)=> {
    res.cookie('facebookId',req.body.facebookId,{domain:'.ronchon-croissant-34901.herokuapp.com'});
    if (found === null) {
      const newUser = new User({
        username: req.body.username,
        facebookId: req.body.facebookId,
      });
      newUser.save((err, newUser)=> {
        res.json({err: err, found: found, mongooseId: newUser._id});
        // localStorage.setItem('facebookUser',newUse._id);
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
          // localStorage.setItem('facebookUser',found._id);
          res.json({err:err,mongooseId:found._id});
          return;
        })
      })
    }
  })
});

module.exports = routes;
