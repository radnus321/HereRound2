const apikey = import.meta.env.VITE_APIKEY;
const appid = import.meta.env.VITE_APPID;
const mapContainer = document.getElementById("map");
console.log(apikey);
console.log(appid);
const platform = new H.service.Platform({
	apikey: apikey,
});
console.log(platform);
const defaultLayers = platform.createDefaultLayers();
console.log(defaultLayers);
const map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
	zoom: 7,
	center: { lat: 17.4065, lng: 78.4772 },
	pixelRatio: window.devicePixelRatio || 1,
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

window.addEventListener("resize", () => map.getViewPort().resize());
