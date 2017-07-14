import express from 'express';
import models from '../public/models/models';

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
  User.findOne({_id:req.params.mongooseId}).exec((err,found)=> {
    if (err) {res.send(err)};
    else {
      res.render('friendList',{
        friendList:found.friendList
      })
    }
  })
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
      res.json({err:err,found:found,mongooseId:found._id});
    }
  })
});

export default routes;
