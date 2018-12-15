window.onload = function(){ 
function isOnline() {
    return window.navigator.onLine;
}

var useLocalStorage = false;

const title =  document.getElementById('title');
const short_descr = document.getElementById('short_descr');
const long_descr = document.getElementById('long_descr');
const img = document.getElementById('fileform')

class News {
  constructor(title, short_descr, long_descr, img) {
    this.title =  title;
    this.short_descr = short_descr;
    this.long_descr = long_descr;
    this.img = img;
  }
}


const onSubmitPress = function(e){
  e.preventDefault();
  title_v = title.value.trim();
  short_descr_v = short_descr.value.trim()
  long_descr_v = long_descr.value.trim()

  if (title_v != 0 && short_descr_v != 0 && long_descr_v != 0) {
    var news = new News(title_v, short_descr_v, long_descr_v, img.files[0].name);
    storeMessage(news);
  } 
  else if (title_v == 0 && short_descr_v == 0 && long_descr_v == 0){
    alert("Fill in all fields!");
    return;
  }
  else if (title_v == 0 && short_descr_v == 0){
    alert("You should fill in title and short description!");
    return;
  }
  else if (title_v == 0 && long_descr_v == 0){
    alert("You should fill in title and long description!");
    return;
  }
  else if (long_descr_v == 0 && short_descr_v == 0){
    alert("You should fill in long and short description!");
    return;
  }
}

function storeMessage(box) {
    if (isOnline()) {
        storeMessageRemotely(box);
    } else {
        storeMessageLocaly(box);
    }
}


function storeMessageRemotely(box) {
    alert('Message sent to server: "' + box.title + '"');
    clearUI();
    return false;
}

function getNews() {
  var news = new Array;
  items = localStorage.getItem("news_list");
    if(items !== null) {
      news = JSON.parse(items);
    }
  return news;
}

function storeMessageLocaly(box) {
  if(useLocalStorage) {
    var news_list = getNews();
    news_list.push(box);
    localStorage.setItem("news_list",JSON.stringify(news_list));
    alert('Message saved locally (localStorage): "' + box.title + '"');
    clearUI();
  }
  else {
    var openDB = indexedDB.open("news_list", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading news");
    };

    openDB.onupgradeneeded = function() {
        var db = openDB.result;
        var store = db.createObjectStore("news", {keyPath: "title"});
        store.createIndex("title", "title", { unique: false });
        store.createIndex("short_descr", "short_descr", { unique: false });
        store.createIndex("long_descr", "long_descr", { unique: false });
        store.createIndex("img", "img", { unique: false });
    };

    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["news"], "readwrite");
      var store = tx.objectStore("news");
      var addFeedback = store.put(box);
      addFeedback.onsuccess = function(event){
        alert('Message saved locally (indexedDB): "' + box.title + '"');
        clearUI();
      }
      addFeedback.onerror = function(event){
        alert("Error occurred when loading news");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
}

function clearUI () {
    title.value = '';
    short_descr.value = '';
    long_descr.value = '';
    img.value = '';
    return false;
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
  }
}

$("#fileform").change(function() {
  readURL(this);
});

 (function () {
    if (window.applicationCache) {
        window.addEventListener('online', function (e) {
          alert('Back online');
        }, true);

        window.addEventListener('offline', function (e) {
          alert('Gone offline');
        }, true);
    }
})();

const addButton = document.getElementById('submit-btn');
addButton.onclick = onSubmitPress;
}
