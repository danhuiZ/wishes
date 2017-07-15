// var express = require('express');
// var exphbs = require('express-handler');
//
// var app = express();

// app.get('/login',function(req,res) {
document.addEventListener('DOMContentLoaded', function(a) {
  let facebookid = "";
  $.ajax({
    url:'https://ronchon-croissant-34901.herokuapp.com/authenticate',
    method:'post',
    success:function(data) {
      alert(data)
      if (data.facebookid !== "") {
        alert("logged in")
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          window.open('https://ronchon-croissant-34901.herokuapp.com/'+data.facebookid+'/friendList');
        })
        facebookid = data.facebookid;
        alert("you logged in as "+ data.name)
        chrome.browserAction.setIcon({path: "color.png"});
      } else {
        alert('haven');
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          alert("clicking");
          window.open('https://ronchon-croissant-34901.herokuapp.com/');
        })
      }
    }
  })

  function onClickHandler(e,tabs) {
    alert("clicked");
    if (e.mediaType === "image") {
      $.ajax({
        url:"https://ronchon-croissant-34901.herokuapp.com/"+facebookid+"/addWishList",
        method:"post",
        data:{
          img:e.srcUrl,
          url:e.pageUrl,
          name:tabs.title
        },
        success: function(res) {
          alert(res.success)
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
