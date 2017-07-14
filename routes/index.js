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

routes.get('/friendList',(req,res)=> {
  res.send("friens")
});

routes.post('/friendList',(req,res)=> {
  User.findOne({facebookId:req.body.facebookId},(err,found)=> {
    if (found === null) {
      const newUser = new User({
        username: req.body.username,
        facebookId: req.body.facebookId,
      });
      newUser.save((err)=> {
        res.json({err:err});
        return;
      })
    } else {
      res.json({err:err,found:found});
    }
  })
  // res.send(req.body.response);
  // res.json({response:req.body.response});
  // res.redirect('/friendList');
});

export default routes;
