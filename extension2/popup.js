// var express = require('express');
// var exphbs = require('express-handler');
//
// var app = express();

// app.get('/login',function(req,res) {
document.addEventListener('DOMContentLoaded', function(a) {
    $.ajax({
      url:'https://cff1e058.ngrok.io/authenticate',
      method:'post',
      success:function(data) {
        if (data.facebookid) {
          let div = document.createElement('button');
          div.innerText="view wish list";
          div.setAttribute('id','viewWishList');
          document.body.appendChild(div);
          document.getElementById('viewWishList').addEventListener('click',function() {
            window.open('https://cff1e058.ngrok.io/'+data.facebookid+'/friendList');
          })
        } else {
          let div = document.createElement('button');
          div.innerText="connect to facebook";
          div.setAttribute('id','connectFB');
          document.body.appendChild(div);
          document.getElementById('connectFB').addEventListener('click',function() {
            window.open('https://cff1e058.ngrok.io/login');
          })
        }
      }
    })
    var imgs = document.getElementsByTagName("img");
    for(var i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener("click", function() {
            alert(this.src);
        });
    }
  function onClickHandler(info, tab) {
    var images = document.getElementsByTagName('img')//[0].getAttribute('src');
    var url = "no images";
    alert(images.length)
    if(images.length !== 0){
      alert("there is length!!");
      alert(Object.keys(images))
      url = images[0].getAttribute('src');
    }
    if(info.menuItemId == "picture"){
      alert(Object.keys(info));
      alert(Object.keys(tab));
      alert(info.pageUrl);
      alert(Object.keys(images));
      alert(url);
    }
  };
  
  // Set up context menu tree at install time.
  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({"title": "Save picture", "id": "picture"});
    chrome.contextMenus.onClicked.addListener(onClickHandler);
  });
    // document.getElementById('onlyButton').addEventListener('click', function() {
    //   window.open('https://www.baidu.com')
    //   })
      // window.open("https://www.facebook.com/v2.9/dialog/oauth?client_id=167922013750290&redirect_uri=https://www.google.com");
      // (function(d, s, id) {
      //   alert("inside functio")
      //   var js, fjs = d.getElementsByTagName(s)[0];
      //   if (d.getElementById(id)) return;
      //   js = d.createElement(s); js.id = id;
      //   js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=167922013750290";
      //   fjs.parentNode.insertBefore(js, fjs);
      // }(document, 'script', 'facebook-jssdk'));
      // chrome.runtime.sendMessage()
      // chrome.tabs.query({'active':true,'windowId':chrome.windows.WINDOW_ID_CURRENT},
      //   function(tabs) {
      //     console.log(tabs[0].url)
      //     window.open('https://www.baidu.com')
      //   }
      // );
      // win.onload = function() {
      //   alert("loaded")
      // }
      // window.open("https://fathomless-retreat-40376.herokuapp.com/auth/facebook")
  });
