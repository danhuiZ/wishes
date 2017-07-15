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

routes.post('/authenticate', (req,res)=> {
  const facebookid = localStorage.getItem('facebookUser');
  res.json({facebookid:facebookid || ""});
})

routes.get('/:friendId/wishlists',(req,res)=> {
  const friendid = req.params.friendId;
  User.findById(friendid).populate('giftList').exec((err,found)=> {
    res.render('wishList',{
      wishes:found.giftList
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
      // while(! newArr) {
      //   newArr = foundAllids(mongooseidArr);
      // }
      // found.update({friendsList:found.friendsList}).exec((err,saved)=> {
      //   res.json({err:err,mongooseId:found._id});
      //   localStorage.setItem('facebookUser',found._id);
      //   return;
      // })
      // let c = found.friendsList || [];
      // const mongooseidArr = req.body.friendList.split('/');
      // for (let i=0;i < mongooseidArr.length;i++) {
      //   console.log(i)
      //   User.findOne({facebookId:mongooseidArr[i]}).exec((err,foundUser)=> {
      //     console.log(foundUser);
      //     if (c.indexOf(foundUser._id.toString()) === -1) {
      //       console.log("not inside");
      //       c.push(foundUser._id.toString());
      //       found.friendsList = c;
      //     }
      //     found.update({friendsList:found.friendsList}, function(err,saved) {
      //       console.log(saved.friendsList.length,mongooseidArr.length);
      //       console.log("after update")
      //     })
      //     if (found.friendsList.length === mongooseidArr.length) {
      //       res.json({err:err,mongooseId:found._id});
      //       return;
      //     }
      //   })
      // }
      // const updatedFriendArr = req.body.friendList.split('/').map( friend=>{
      //   let mongooseId = "";
      //   User.findOne({facebookId:friend}).exec((err,foundUser)=>{
      //     mongooseId = foundUser._id;
      //   })
      //   return mongooseId;
      // });
      //   console.log("updatedFriendARr"+updatedFriendArr);
      // User.findByIdAndUpdate(found._id,{friendsList:mongooseidArr}, function(err,saved) {
      //   console.log(found._id);
      //   console.log(saved)
      // })

      // found.friendsList = [...mongooseidArr];
      // console.log(found.friendsList);
      // found.save((err,saved)=> {
      //   console.log(saved);
      //   res.json({err:err,mongooseId:found._id});
      // });
    }
  })
});

module.exports = routes;
