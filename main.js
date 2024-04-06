import axios from "axios";
const apikey = import.meta.env.VITE_APIKEY;
const appid = import.meta.env.VITE_APPID;
// import { loadingOff } from "./src/App";
const mapContainer = document.getElementById("map");
const platform = new H.service.Platform({
	apikey: apikey,
});
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
	zoom: 10,
	center: { lat: 28.3802, lng: 75.6092 },
	pixelRatio: window.devicePixelRatio || 1,
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

window.addEventListener("resize", () => map.getViewPort().resize());
let radius = 300;

const getShopIndex = async (add) => {
	let shopCount = 0;
	const loc = add.split(" ");
	const URL = `https://discover.search.hereapi.com/v1/discover?in=circle:${loc[0]}${loc[1]};r=${radius}&q=shops&apiKey=${apikey}`;

	await axios.get(URL).then((response) => {
		const items = response.data.items;
		shopCount = items.length;
	});
	return shopCount;
};

const getRestaurantIndex = async (add) => {
	let restaurantCount = 0;
	const loc = add.split(" ");
	const URL = `https://discover.search.hereapi.com/v1/discover?in=circle:${loc[0]}${loc[1]};r=${radius}&q=restaurant&apiKey=${apikey}`;
	await axios.get(URL).then((response) => {
		const items = response.data.items;
		restaurantCount = items.length;
	});
	return restaurantCount;
};

const getJamIndex = async (add) => {
	let sum = 0;
	let length = 1;
	const loc = add.split(" ");
	const URL = `https://data.traffic.hereapi.com/v7/flow?in=circle:${loc[0]}${loc[1]};r=${radius}&locationReferencing=olr&apiKey=${apikey}`;
	await axios.get(URL).then((response) => {
		const items = response.data.results;
		length = items.length;
		items.map((item) => {
			sum += item.currentFlow.jamFactor;
		});
	});
	return sum == 0 ? 0 : sum / length;
};

function markerLocation(id) {
	const temp = id;
	const center = map.getCenter();
	const marker = new H.map.Marker(center, { volatility: true });
	marker.draggable = true;
	map.addObject(marker);

	// Add event listeners for marker movement
	map.addEventListener(
		"dragstart",
		(evt) => {
			if (evt.target instanceof H.map.Marker) behavior.disable();
		},
		false
	);
	map.addEventListener(
		"dragend",
		function dragEndFunc(evt) {
			const idNo = temp;
			if (evt.target instanceof H.map.Marker) {
				console.log(evt.target.getGeometry());
				behavior.enable();
				const loc = evt.target.getGeometry();
				document.getElementById(
					`input${idNo}`
				).value = `${loc.lat}, ${loc.lng}`;
				map.removeObject(evt.target);
				map.removeEventListener("dragend", dragEndFunc, false);
			}
		},
		false
	);
	map.addEventListener(
		"drag",
		(evt) => {
			const pointer = evt.currentPointer;
			if (evt.target instanceof H.map.Marker) {
				evt.target.setGeometry(
					map.screenToGeo(pointer.viewportX, pointer.viewportY)
				);
			}
		},
		false
	);
}

function radiChange(rad) {
	radius = rad;
}

let markers = [];
let group = new H.map.Group();

async function compare() {
	let coordinates = [];
	coordinates.push(document.getElementById("input1").value);
	coordinates.push(document.getElementById("input2").value);

	// Clear the previous markers
	for (let i = 0; i < markers.length; i++) {
		map.removeObject(markers[i]);
	}
	markers = [];
	coordinates.map((coordinate) => {
		const loc = coordinate.split(",");
		const marker = new H.map.Marker({ lat: loc[0], lng: loc[1] });
		map.addObject(marker);
		markers.push(marker);
	});
	// group = new H.map.Group();
	// // add markers to the group
	// group.addObjects(markers);
	// map.addObject(group);

	// // get geo bounding box for the group and set it to the map
	// map.getViewModel().setLookAtData({
	// 	bounds: group.getBoundingBox(),
	// });
	// //Need a way to zoom out a little
	let comp = 0;

	await Promise.all([
		getShopIndex(coordinates[0]),
		getShopIndex(coordinates[1]),
	]).then((values) => {
		const normalizingFactor = 10;
		if (values[0] > values[1]) {
			comp -= normalizingFactor;
		}
		if (values[0] < values[1]) {
			comp += normalizingFactor;
		}
	});
	await Promise.all([
		getJamIndex(coordinates[0]),
		getJamIndex(coordinates[1]),
	]).then((values) => {
		const normalizingFactor = 8;
		if (values[0] > values[1]) {
			comp += normalizingFactor;
		}
		if (values[0] < values[1]) {
			comp -= normalizingFactor;
		}
	});
	await Promise.all([
		getRestaurantIndex(coordinates[0]),
		getRestaurantIndex(coordinates[1]),
	]).then((values) => {
		const normalizingFactor = 5;
		if (values[0] > values[1]) {
			comp += normalizingFactor;
		}
		if (values[0] < values[1]) {
			comp -= normalizingFactor;
		}
	});
	// loadingOff();
	console.log(comp);
	const res = document.getElementById("result");
	if (comp > 0) {
		res.innerHTML = "Location 1 is better than Location 2";
	}
	if (comp < 0) {
		res.innerHTML = "Location 2 is better than Location 1";
	}
	if (comp == 0) {
		res.innerHTML = "Both locations are equally good";
	}
}

export { markerLocation, radiChange, compare };
