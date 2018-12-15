class Review{
  constructor(title, review, datetime) {
    this.title = title;
    this.review = review;
    this.datetime = datetime;
  }
}

function reviewTemplate (review) {
  var title = review.title;
  var text = review.review;
  var datetime = review.datetime;

  return `
    <div class="post-preview">
      <h2 class="post-title">${title}</h2>
      <p class="post-subtitle">${text}</p>
      <div class="row">
        <div class="col-auto">
          <p class="post-meta">Posted on ${datetime}</p>
        </div>
        <div class="col-auto">
          <p class="author"> <a href="#" style="float: right;">by anonymous</a></p>
        </div>
      </div>
    </div>
    `
}

var useLocalStorage = true;

function isOnline() {
    return window.navigator.onLine;
}

function load_data() {
  if(isOnline() && useLocalStorage) {
    items = JSON.parse(localStorage.getItem("reviews"));
    if(items) {
      for(var i = 0; i < items.length; i++){
        var temp = new Review(items[i].title, items[i].review, items[i].datetime)
        $('#posts').append(
          reviewTemplate(temp)
        );
      }
    }
  }
  if(isOnline() && !useLocalStorage) {
      var openDB = indexedDB.open("reviews-data", 1);
      openDB.onupgradeneeded = function() {
          var db = openDB.result;
          var store = db.createObjectStore("reviews", {keyPath: "title"});
          store.createIndex("title", "title", { unique: false });
          store.createIndex("review", "review", { unique: false });
          store.createIndex("datetime", "datetime", { unique: false });
      }
      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var tx = db.transaction("reviews", "readwrite");
          var store = tx.objectStore("reviews");
          store.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;

          if (cursor) {
            var temp = new Review(cursor.value.title, cursor.value.review, cursor.value.datetime);
              $('#posts').append(reviewTemplate(temp));
              cursor.continue();
          }
        };
          tx.oncomplete = function(){
            db.close();
          }
      } 
  }
  if (!isOnline()) {
    alert("You are offline");
  }
}

reviews = []

function send() {
  var review =  document.getElementById('review');
  if(review.value.trim() != "") {
    var new_review = {};
    new_review.title = review.value.split("\n",1)[0];
    new_review.review = review.value;
    var date = new Date();
    new_review.datetime = date.getDate() + "."
                + (date.getMonth()+1)  + "." 
                + date.getFullYear() + "\t"  
                + date.getHours() + ":"  
                + date.getMinutes();
    if(!isOnline() && useLocalStorage) {
      reviews.push(new_review)
      localStorage.setItem("reviews",JSON.stringify(reviews));
      alert('Message saved locally: "' + new_review.title + '"');
    }
    if(isOnline() && useLocalStorage) {
      $('#posts').append(
        reviewTemplate(new_review));
        alert('Message sent to server: "' + new_review.title + '"');
    }
    if(!useLocalStorage) {
      var openDB = indexedDB.open("reviews-data", 1);

      openDB.onerror = function(event) {
        alert("Error occurred when loading review");
      };

      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var tx = db.transaction(["reviews"], "readwrite");
        var store = tx.objectStore("reviews");
        var temp = new Review(new_review.title, new_review.review, new_review.datetime);
        console.log(temp);
        var addReview = store.put(temp);
        addReview.onsuccess = function(event){
          alert("Review created");
        }
        addReview.onerror = function(event){
          alert("Error occurred when loading reviews");
        }
        tx.oncomplete = function(){
          db.close();
        }
      };
    }
  }
  else {
    alert("Review must be filled out");
    return;
  }
  clearUI();
}


function clearUI () {
    document.getElementById('review').value = '';
}

function sendAllToServer() {
  items = JSON.parse(localStorage.getItem("reviews"));
    for(var i = 0; i < items.length; i++){
       alert("Sending to server item " + items[i].title);
    }
    localStorage.removeItem("reviews");
}

 (function () {
    if (window.applicationCache) {
        window.addEventListener('online', function (e) {
          alert('Back online');
          load_data();
        }, true);

        window.addEventListener('offline', function (e) {
          alert('Gone offline');
        }, true);
    }
})();