// var express = require('express');
// var exphbs = require('express-handler');
//
// var app = express();

// app.get('/login',function(req,res) {
document.addEventListener('DOMContentLoaded', function(a) {
    $.ajax({
      url:'https://ronchon-croissant-34901.herokuapp.com/authenticate',
      method:'post',
      success:function(data) {
        if (data.facebookid !== "") {
          alert("yeah~~")
          chrome.browserAction.setIcon({path: "IMG_0017.png"});
          alert("notworking");
          let div = document.createElement('button');
          div.innerText="view wish list";
          div.setAttribute('id','viewWishList');
          document.body.appendChild(div);
          document.getElementById('viewWishList').addEventListener('click',function() {
            window.open('https://ronchon-croissant-34901.herokuapp.com/'+data.facebookid+'/friendList');
          })
        } else {
          let div = document.createElement('button');
          div.innerText="connect to facebook";
          div.setAttribute('id','connectFB');
          document.body.appendChild(div);
          document.getElementById('connectFB').addEventListener('click',function() {
            window.open('https://ronchon-croissant-34901.herokuapp.com');
          })
        }
      }
    })

    function onClickHandler(e,tabs) {
      alert("clicked");
      if (e.mediaType === "image") {
        $.ajax({
          url:'https://ronchon-croissant-34901.herokuapp.com/addWish'
        })
        alert("image");
        alert(e.srcUrl)
        alert(e.pageUrl)
        // buzzPostUrl += "imageurl=" + encodeURI(e.srcUrl) + "&";
      }
      // var imgs = document.getElementsByTagName("img");
      // for(var i = 0; i < imgs.length; i++) {
      //     imgs[i].addEventListener("click", function() {
      //         alert(this.src);
      //     });
      // }
      // var url = "no images";
      // alert(images.length)
      // if(images.length !== 0){
      //   alert("there is length!!");
      //   alert(Object.keys(images))
      //   url = images[0].getAttribute('src');
      // }
      // if(info.menuItemId == "picture"){
      //   alert(Object.keys(info));
      //   alert(Object.keys(tab));
      //   alert(info.pageUrl);
      //   alert(Object.keys(images));
      //   alert(url);
      // }
    };

  // Set up context menu tree at install time.
    chrome.runtime.onInstalled.addListener(function() {
      chrome.contextMenus.create({"title": "Save picture", "contexts": ["image"],"id": "picture", "onclick":onClickHandler});
    });
  });
