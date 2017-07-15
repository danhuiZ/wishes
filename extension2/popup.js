// var express = require('express');
// var exphbs = require('express-handler');
//
// var app = express();

// app.get('/login',function(req,res) {
document.addEventListener('DOMContentLoaded', function(a) {
  let allURL = [];
  let mongooseid = "";
  $.ajax({
    url:'https://ronchon-croissant-34901.herokuapp.com/authenticate',
    method:'post',
    success:function(data) {
      if (data.facebookid !== "") {
        mongooseid = data.facebookid;
        allURL = [...data.urls];
        chrome.browserAction.setIcon({path: "color.png"});
        chrome.tabs.onUpdated.addListener(function(tab){
          chrome.tabs.getAllInWindow(null, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
              if (allURL.indexOf(tabs[i].url.toString()) !== -1) {
                chrome.notifications.create({type:'basic', iconUrl:'https://68.media.tumblr.com/c7c539e52b98d5c3135cebb238b4d39d/tumblr_ot4abpNFfa1rwyec1o1_75sq.png', title:"Wish List", message:"One of your tabs contain your friend's wish"})
              }
            }
          })
        })
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          window.open('https://ronchon-croissant-34901.herokuapp.com/'+mongooseid+'/friendList');
        })
      } else {
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          window.open('https://ronchon-croissant-34901.herokuapp.com/');
        })
      }
    }
  })

  function onClickHandler(e,tabs) {
    if (e.mediaType === "image") {
      $.ajax({
        url:"https://ronchon-croissant-34901.herokuapp.com/"+mongooseid+"/addWishList",
        method:"post",
        data:{
          img:e.srcUrl,
          url:e.pageUrl,
          name:tabs.title
        },
        success: function(res) {
          if (res.success) {
            alert("your wish has been saved!")
          }
        }
      })
    }
  };

  chrome.runtime.onInstalled.addListener(function() {
    var parent = chrome.contextMenus.create({"title": "Choose your wish list", "contexts": ["image"]});
    chrome.contextMenus.create({"title": "Save to public", "parentId": parent, "contexts": ["image"],"onclick": onClickHandler});
    chrome.contextMenus.create({"title": "Save to privacy", "contexts": ["image"],"parentId": parent});
    chrome.contextMenus.create({"title": "Save to family", "contexts": ["image"],"parentId": parent});
    chrome.contextMenus.create({"title": "Save to college friends", "contexts": ["image"],"parentId": parent});
  // chrome.contextMenus.onClicked.addListener(onClickHandler);
  });
});
