import express from 'express';

const routes = express();

routes.get('/',(req,res)=> {
  res.render('mainpage',{
    errors:"cool"
  })
});

routes.post('/',(req,res)=> {
  
});
export default routes;
