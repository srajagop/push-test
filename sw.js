self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  console.log('Closed notification: ');
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } 
  self.registration.getNotifications().then(notifications => {
    notifications.forEach(notification => {
      notification.close();
    });
  });
});

self.addEventListener('push', event => {

});

const dbName = "eventDB";
let db;
let isDBLoaded = false;
let request = indexedDB.open(dbName, 1);

request.onerror = function(event) {
  // Handle errors.
};
request.onsuccess = function(event) {
  db = event.target.result;
};
request.onupgradeneeded = function(event) {
  db = event.target.result; 
  var objectStore = db.createObjectStore("events",  { autoIncrement : true, keyPath: "id" } );
  objectStore.transaction.oncomplete = function(event) {

	const eventsData = [
		{ id: "123", name: "John's Meeting", date: "June 03 2019 14:40" , notified: false},
		{ id: "124", name: "Donna's Meeting", date: "June 03 2019 16:10", notified: false }
	];
    var eventsObjectStore = db.transaction("events", "readwrite").objectStore("events");
    eventsData.forEach(function(event) {
      eventsObjectStore.add(event);
    });
  };

};

function getData(){
	db.transaction("events").objectStore("events").getAll().onsuccess = function(event){
		event.target.result.filter((record)=> {
			let diff = (new Date(record.date) - new Date()) /1000/60;
			if(record.notified === false){
				if( diff <= 20){
					updateDB(record.id)
					self.registration.showNotification(record.name + "@" + record.date);
				}				
			}

		})
	};
}
function updateDB(id) {
	var transaction = db.transaction("events", "readwrite")
	var objectStore = transaction.objectStore("events");
	var request = objectStore.get(id);
	request.onsuccess = function(event){
		var data = event.target.result;
		data.notified = true;
		var requestUpdate = objectStore.put(data);
		requestUpdate.onerror = function(event) {
			 // Do something with the error
		};
		requestUpdate.onsuccess = function(event) {
		// Success - the data is updated!
		};
	};
}
function readDB(){
	setInterval(function(){
		console.log(request)
		getData();		
	}, 15000)
}
readDB();


self.addEventListener('activate', function(event) {

});

