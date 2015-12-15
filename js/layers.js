// For Reference:
// idx 0 ~ this.AbandonLayer           = new L.LayerGroup(); // Abandoned Vehicles
// idx 1 this.StreetLightLayer       = new L.LayerGroup(); // Street Lights Out
// idx 2 this.PotHolesLayer          = new L.LayerGroup(); // Pot Holes
        //~ this.DivvyStationLayer      = new L.LayerGroup(); // Divvy Station Layer
        //~ this.RecentCrimeLayer       = new L.LayerGroup(); // Recent Crime Layer
        //~ this.RestPOILayer           = new L.LayerGroup(); // Food Inspection
        //~ this.RestaurantLayer        = new L.LayerGroup(); // Active Restaurants



function clearAllLayers() {
	m = mapContainer;
	window.started = false;

	clearInterval(busLoop);
	clearInterval(weatherLoop);
	clearInterval(potholeLoop);
	clearInterval(divvyLoop);
	clearInterval(tickerLoop);
	clearInterval(abandonLoop);
	clearInterval(crimeLoop);
	clearInterval(streetlightLoop);
	clearInterval(divvyLoop);
	d3.selectAll(".leaflet-marker-pane").html(null);
}

function toggleLayer(layerName) {
	/*if (!window.started) {
		$('#top-message').toggle('drop', {direction: 'up'});
		setTimeout(function () {
			$('#top-message').toggle('drop', {direction: 'down'});	
		}, 7000);
		return;
	} */
	
	// for convenience
	m = mapContainer;
	//console.log("Display Layer");
	if (layerName == "WeatherLayer") {
		jQuery('#weather').toggle('fold');
		jQuery('#weathericon').toggleClass("selected", 1000, "easeOutSine" );
	}
	else if (layerName == "ZipCodeLayer") {
		if (m.map.hasLayer(m.ZipCodeLayer)) {
			m.map.removeLayer(m.ZipCodeLayer);
			$("div").remove(".info.leaflet-control");
		} else {
			m.map.addLayer(m.ZipCodeLayer);
			zipCodeApp.createTotalLegends();

		}
		jQuery('#ZipcodeIcon').toggleClass("selected", 1000, "easeOutSine" );
	}	else if (layerName == "CountyLayer") {
		if (m.map.hasLayer(m.CountyLayer)) {
			m.map.removeLayer(m.CountyLayer);
		} else {
			m.map.addLayer(m.CountyLayer);
		}
		jQuery('#CountyIcon').toggleClass("selected", 1000, "easeOutSine" );
	}
	else if (layerName == "AsthmaLayer") {
		if (m.map.hasLayer(m.AsthmaLayer)) {
			m.map.removeLayer(m.AsthmaLayer);
			$("div").remove(".info.leaflet-control");
		} else {
			zipCodeApp.zipAsthmaFunc();
			m.map.addLayer(m.AsthmaLayer);
			zipCodeApp.createAsthmaLegends();
		}
		jQuery('#AsthmaIcon').toggleClass("selected", 1000, "easeOutSine" );
	}
	else if (layerName == "DiabetesLayer") {
		if (m.map.hasLayer(m.DiabetesLayer)) {
			m.map.removeLayer(m.DiabetesLayer);
			$("div").remove(".info.leaflet-control");
		} else {
			m.map.addLayer(m.DiabetesLayer);
			zipCodeApp.createDiabetesLegends();
		}
		jQuery('#DiabetesIcon').toggleClass("selected", 1000, "easeOutSine" );
	}	
	else if (layerName == "SCDLayer") {
		if (m.map.hasLayer(m.SCDLayer)) {
			m.map.removeLayer(m.SCDLayer);
			$("div").remove(".info.leaflet-control");
		} else {
			m.map.addLayer(m.SCDLayer);
			zipCodeApp.createSCDLegends();
		}
		jQuery('#SCDIcon').toggleClass("selected", 1000, "easeOutSine" );
	}
	else if (layerName == "OtherLayer") {
		if (m.map.hasLayer(m.OtherLayer)) {
			m.map.removeLayer(m.OtherLayer);

			$("div").remove(".info.leaflet-control");
		} else {
			m.map.addLayer(m.OtherLayer);
			zipCodeApp.createOtherLegends();
		}
		jQuery('#OtherIcon').toggleClass("selected", 1000, "easeOutSine" );
	}
	else if (layerName == "TotalAgesLayer"){
		if (m.map.hasLayer(m.TotalAgesLayer)){
			m.map.removeLayer(m.TotalAgesLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.TotalAgesLayer);
		}
	}
	else if (layerName == "UnderAgesLayer"){
		if (m.map.hasLayer(m.UnderAgesLayer)){
			m.map.removeLayer(m.UnderAgesLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.UnderAgesLayer);
		}
	}
	else if (layerName == "AboveAgesLayer"){
		if (m.map.hasLayer(m.AboveAgesLayer)){
			m.map.removeLayer(m.AboveAgesLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.AboveAgesLayer);
		}
	}	
	else if (layerName == "InPatientLayer"){
		if (m.map.hasLayer(m.InPatientLayer)){
			m.map.removeLayer(m.InPatientLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.InPatientLayer);
		}
	}
	else if (layerName == "OutPatientLayer"){
		if (m.map.hasLayer(m.OutPatientLayer)){
			m.map.removeLayer(m.OutPatientLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.OutPatientLayer);
		}
	}
	else if (layerName == "NipsPatientLayer"){
		if (m.map.hasLayer(m.NipsPatientLayer)){
			m.map.removeLayer(m.NipsPatientLayer);
			$("div").remove(".info.leaflet-control");
		}
		else{
			m.map.addLayer(m.NipsPatientLayer);
		}		
	}
	else if (layerName == "DisplayLayer"){
		
		// m.map.removeLayer(m.AsthmaLayer);
		if(m.map.hasLayer(m.AsthmaLayer)){
			m.AsthmaLayer.clearLayers();
		}
		
		$("div").remove(".info.leaflet-control");
		zipCodeApp.zipAsthmaFunc();
		m.map.addLayer(m.AsthmaLayer);
		zipCodeApp.createAsthmaLegends();
		jQuery('#DisplayIcon').toggleClass("selected", 1000, "easeOutSine" );
	}
}

function selectMap(layerName) {
	if (layerName == 'Aerial') {
		mapContainer.map.removeLayer(mapContainer.ColorView);
		mapContainer.map.removeLayer(mapContainer.MapView);
		mapContainer.map.addLayer(mapContainer.Aerial);
		d3.select("#Aerial").attr("class", "selected");
		d3.select("#ColorView").attr("class", "");
		d3.select("#MapView").attr("class", "");
	} else if (layerName == 'ColorView') {
		mapContainer.map.removeLayer(mapContainer.Aerial);
		mapContainer.map.removeLayer(mapContainer.MapView);
		mapContainer.map.addLayer(mapContainer.ColorView);
		d3.select("#ColorView").attr("class", "selected");
		d3.select("#Aerial").attr("class", "");
		d3.select("#MapView").attr("class", "");
	} else if (layerName == 'MapView') {
		mapContainer.map.removeLayer(mapContainer.ColorView);
		mapContainer.map.removeLayer(mapContainer.Aerial);
		mapContainer.map.addLayer(mapContainer.MapView);
		d3.select("#MapView").attr("class", "selected");
		d3.select("#ColorView").attr("class", "");
		d3.select("#Aerial").attr("class", "");
	}
}


