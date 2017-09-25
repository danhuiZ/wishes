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
  res.clearCookie('facebookId',{domain:'.mydeseos.herokuapp.com'});
  res.render('logout');
});

routes.get('/mostpopular',(req,res)=> {
  res.render('mostpopular');
});

routes.get('/:userId/addToMyWishList/:giftid', (req,res) => {
	User.findById(req.params.userId).exec((err,foundUser) => {
		Gift.findById(req.params.giftid).exec((err, foundGift) => {
			updateOwnerArr = [...foundUser.giftList];
			updateOwnerArr.push(foundGift._id);
			foundUser.giftList = updateOwnerArr;
			foundUser.update({giftList:foundUser.giftList}).exec((err,updated) => {
				res.redirect('/'+foundUser._id + '/wishlists')
			})
		});
	});
});

routes.get('/:userId/delete/:giftid',(req,res)=> {
  Gift.findById(req.params.giftid).remove().exec((err,removed)=> {
    User.findById(req.params.userId).exec((err,foundUser)=> {
      const giftArr = foundUser.giftList.filter(a=> {
        return a.toString() !== req.params.giftid;
      });
      foundUser.giftList = giftArr;
      foundUser.update({giftList:foundUser.giftList}).exec((err,updated)=> {
        res.redirect('/'+req.params.userId+'/wishlists');
      })
    })
  });
});

routes.get('/:userId/wishlists',(req,res)=> {
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

routes.get('/:userId/adoptedwishes', (req,res)=> {
	const selfId = req.params.userId;
	User.findById(selfId).populate('adoptedGift').exec((err, foundSelf)=> {
		res.render('wishList', {
			adoptPage:true,
			wishes: foundSelf.adoptedGift,
			selfId: selfId
		})
	})
})

routes.get('/:userId/:friendId/wishlists', (req,res)=> {
  const selfId = req.params.userId;
  const friendid = req.params.friendId;
  User.findById(selfId).populate('friendsList').exec((err, foundSelf)=> {
		if (foundSelf) {
			User.findById(friendid).populate('giftList').exec((err, foundFriend)=> {
				console.log(req.params.userId);
	      res.render('wishList',{
	        wishes: foundFriend.giftList.reverse(),
	        found: foundSelf,
	        friend: foundFriend,
	        friendList: foundSelf.friendsList,
	        selfPage: false,
	        friendId: friendid,
					userId:req.params.userId
	      })
	    })
		}
  })
})

routes.get('/:wishid/:userid/cancel', (req, res)=> {
	const giftid = req.params.wishid;
	const selfid = req.params.userid;
	Gift.findById(giftid).exec( (err, found)=> {
		if (found) {
			found.adopted = false;
			found.adoptedUser = [];
			found.update({adopted:found.adopted, adoptedUser: found.adoptedUser})
			.exec( (err, updated)=> {
				if (err) {
					console.log(err);
				} else {
					console.log("successfully updated");
					User.findById(selfid).populate('adoptedGift').exec( (err, foundUser)=> {
						if (foundUser) {
							var newArr = [];
							for (var i=0; i < foundUser.adoptedGift.length; i++) {
								if (foundUser.adoptedGift[i]._id !== giftid) {
									console.log(foundUser.adoptedGift[i]._id)
									newArr.push(foundUser.adoptedGift[i]);
								} else {
									console.log("found the one that's the same", giftid);
								}
							}
							foundUser.adoptedGift = newArr;
							foundUser.update({adoptedGift:foundUser.adoptedGift}).exec( (err, updated)=> {
								if (err) {
									console.log(err);
								} else {
									res.redirect('/'+selfid+'/adoptedwishes');
								}
							})
						}
					})
				}
			})
		}
	})
})
routes.get('/:wishid/:friendId/adopt', (req,res)=> {
  const userid = req.cookies.facebookId;
  const giftid = req.params.wishid;
	const friendid = req.params.friendId;
  Gift.findById(giftid).exec((err,found)=> {
		User.findOne({facebookId:userid}).exec((err,foundUser)=> {
			if (foundUser) {
				found.adopted = true;
				found.adoptedUser.push(foundUser._id);
				found.update({adopted:found.adopted, adoptedUser:found.adoptedUser})
					.exec((err,updated)=>{
						foundUser.adoptedGift.push(found._id);
						foundUser.update({adoptedGift:foundUser.adoptedGift})
						.exec( (err, updatedUser)=> {
							if (err) {
								alert("Sorry, there's something wrong with your current move.\n Please try again later.")
							} else {
								res.redirect('/'+foundUser._id+'/'+friendid+'/wishlists');
							}
						})
		    })
			}
		})
  })
})

routes.post('/:userId/addWishList', (req, res) => {
  const userId = req.params.userId;
	let right = "public";
	if (req.body.private === 'true') {
		right = "private";
	}
  const newGift = new Gift({
    imgUrl: req.body.img,
    purchaseUrl: req.body.url,
    name: req.body.name,
    right: right,
		private: req.body.private
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
    res.cookie('facebookId',req.body.facebookId,{domain:'.mydeseos.herokuapp.com'});
    if (found === null) {
      const newUser = new User({
        username: req.body.username,
        facebookId: req.body.facebookId,
      });
      newUser.save((err, newUser)=> {
        res.json({err: err, found: found, mongooseId: newUser._id});
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
          res.json({err:err,mongooseId:found._id});
          return;
        })
      })
    }
  })
});

module.exports = routes;
