const express = require('express');
const models = require('../public/models/models');


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
  User.findOne({_id:req.params.userId}).exec((err,found)=> {
    res.render('friendList',{
      friendList:found.friendList,
      found:found,
      error:err
    })
  })
});

routes.post('/friendList',(req,res)=> {
  User.findOne({facebookId:req.body.facebookId},(err,found)=> {
    if (found === null) {
      const newUser = new User({
        username: req.body.username,
        facebookId: req.body.facebookId,
      });
      newUser.save((err,newUser)=> {
        res.json({err:err,found:found,mongooseId:newUser._id});
        return;
      })
    } else {
      // User.findByIdAndUpdate(found._id,{friendList:req.body.friendList.map(friend=>{
      //   User.findOne({facebookId:req.body.facebookId}).exec((err,found)=>{
      //     return found._id;
      //   })
      // })})
      res.json({err:err,found:found,mongooseId:found._id,friendList:req.body.friendList});
    }
  })
});

module.exports = routes;
