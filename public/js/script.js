const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position)=> {
        const { latitude, longitude } = position.coords;
        socket.emit("send-Location", { latitude, longitude });
    },(error) => {
        console.error(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Berhampur University"
}).addTo(map);

const markers = {};
const routes = {}; // Store routes for each user

socket.on("receive-Location", (data)=> {
   const { id, latitude, longitude } = data;
   map.setView([latitude, longitude]);
   
   if(markers[id]){
       markers[id].setLatLng([latitude, longitude]);
       routes[id].push([latitude, longitude]); // Add new point to the route
       L.polyline(routes[id], {color: 'red'}).addTo(map); // Draw the route
   } else {
       markers[id] = L.marker([latitude, longitude]).addTo(map);
       routes[id] = [[latitude, longitude]]; // Initialize route with the first point
   }
});

socket.on("user-disconnect", (id) => {
   if(markers[id]){
       map.removeLayer(markers[id]);
       delete markers[id];
   }
   if(routes[id]){
       delete routes[id];
   }
});