function isOnline() {
    return window.navigator.onLine;
}

var useLocalStorage = true;

class News {
  constructor(title, short_descr, long_descr, img) {
    this.title =  title;
    this.short_descr = short_descr;
    this.long_descr = long_descr;
    this.img = img;
  }
}

class ServerService {
 async getFromServer() {
    try {
      const data = await fetch('/news/all');
      return data.text();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }
}

function newsTemplate(news) {
	var title =  news.title;
    var short_descr = news.short_descr;
    var long_descr = news.long_descr;
    var photo = news.img;

	return `
	<div class="col-md-6 col-lg-4 col-xl-3"> 
	        <div class="card">
	          <img class="card-img-top img-fluid" src=${photo} alt="Card image">
	          <div class="card-body">
	            <h5 class="card-title">${title}</h5>
	            <p class="card-text">${long_descr}</p>
	            <a href="#" class="btn btn-primary">Read more...</a>
	          </div>
	        </div>
	      </div>
	 `
}

const service = new ServerService();

 const addElementNews = async() => {
 	if(isOnline()) {
 		const items = await service.getFromServer();
	  console.log(items);

	  const itemsStringified = JSON.stringify(items);

	  JSON.parse(items).forEach(({ title, long_descr, photo }) => {
	         var tempNews = new News(title, "", long_descr, photo);
	         $('#news').prepend(
           newsTemplate(tempNews),
         );
   	});
 	}
	if(isOnline() && useLocalStorage){
	items = localStorage.getItem("news_list");
	if(items) {
	    for(var i = 0; i < items.length; i++){
	    	var temp = new News(items[i].title, items[i].short_descr,
			    	items[i].long_descr, items[i].img)
	 		$('#news').prepend(
			    newsTemplate(temp)
			  	);
			}
		}
	}
	else if(isOnline() && !useLocalStorage){
		var openDB = indexedDB.open("news_list", 1);
	    openDB.onupgradeneeded = function() {
	        var db = openDB.result;
	        var store = db.createObjectStore("news", {keyPath: "title"});
	        store.createIndex("title", "title", { unique: false });
	        store.createIndex("short_descr", "short_descr", { unique: false });
	        store.createIndex("long_descr", "long_descr", { unique: false });
	        store.createIndex("img", "img", { unique: false });
	    }
	    openDB.onsuccess = function(event) {
	      var db = openDB.result;
	      var tx = db.transaction("news", "readwrite");
	        var store = tx.objectStore("news");
	        store.openCursor().onsuccess = function(event) {
	        var cursor = event.target.result;

	        if (cursor) {
	          var temp = new News(cursor.value.title, cursor.value.short_descr, cursor.value.long_descr, cursor.value.img);
	          $('#news').prepend(
			    newsTemplate(temp)
			  );
	          cursor.continue();
	        }
	      };
	        tx.oncomplete = function(){
	          db.close();
	        }
	    }
	}
	else {
		alert("You are offline");
	}
}

const onOnline = () => {
  addElementNews();
  console.log('Back online');
}

const onOffline = () => {
  console.log('Gone offline');
}

window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
