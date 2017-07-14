import express from 'express';

const routes = express();

routes.get('/',(req,res)=> {
  res.render('mainpage');
});

routes.get('/login',(req,res)=> {
  res.render('login');
});

routes.get('/friendList',(req,res)=> {

});

routes.post('/friendList',(req,res)=> {
  res.send(req.body.response);
  res.json({response:req.body.response});
  res.redirect('/friendList');
});

export default routes;
