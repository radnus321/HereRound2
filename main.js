import axios from "axios";

const apikey = import.meta.env.VITE_APIKEY;
const appid = import.meta.env.VITE_APPID;
const mapContainer = document.getElementById("map");
const platform = new H.service.Platform({
	apikey: apikey,
});
let userLocationX = 0;
let userLocationY  = 0;
function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition)
	}else{
		console.error("Geolocation is not supported by this browser")
	}
}
function showPosition(position){
	userLocationX = position.coords.latitude;
	userLocationY = position.coords.longitude;
	console.log(userLocationX)
	console.log(userLocationY)
}
getLocation();
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
	zoom: 10,
	center: { lat: 17.4065, lng: 78.4772 },
	pixelRatio: window.devicePixelRatio || 1,
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

window.addEventListener("resize", () => map.getViewPort().resize());
let select = "restaurants"
let radius = 300;

const getShopIndex = async () => {
	let shopCount = 0;
	const URL = `https://discover.search.hereapi.com/v1/discover?in=circle:28.653229,77.308601;r=${radius}&q=shops&apiKey=${apikey}`;
	await axios.get(URL).then((response)=>{
		const items = response.data.items
		shopCount = items.length
	})
	return shopCount
}

const getRestaurantIndex = async () => {
	let restaurantCount = 0;
	const URL = `https://discover.search.hereapi.com/v1/discover?in=circle:28.653229,77.308601;r=${radius}&q=restaurant&apiKey=${apikey}`;
	await axios.get(URL).then((response)=>{
		const items = response.data.items
		restaurantCount = items.length
	})
	return restaurantCount
}

const data = axios.get('https://www.worldpop.org/rest/data');
console.log(data)
