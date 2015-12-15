///////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
//////////////////////////////////////////////////////
var mapContainer = Class.extend({

    construct: function() {
    /////////////////////////////////////////////////////////
    // Calling global variables to be used in functions
    ////////////////////////////////////////////////////////
        this.map = null;
        this.MapView = null;
        this.Aerial = null;
        this.polyline;
        this.svg = null;
        this.polyline = null;
        this.coordinates = null;
        this.Polygon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.custlatlng2 = null;
        this.custlatlng1 = null;
        this.Router = null;
        this.mode = null; // Added to see which mode is the UI running on.
        this.iterator = 'XX';
        this.waypoints = [];
        this.markerArray = [];
        this.potholeRefreshInt = 30000;
        this.busRefreshInt = 3000;
        this.tickerRefreshInt = 5000;
        this.divvyRefreshInt = 10000;
        this.abandonRefreshInt = 30000;
        this.crimeRefreshInt = 30000;
        this.streetlightRefreshInt = 30000;
    ////////////////////////////////////////////////////////////
    //   DEFINING MAP VIEWS TO SHOW AS BASE LAYERS
    ///////////////////////////////////////////////////////////


        this.mapURL1 = 'https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png';
        this.mapCopyright1 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';


        this.mapURL2 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        this.mapCopyright2 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX';

        this.mapURL3 = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    ////////////////////////////////////////////////////////////
    //   DEFINING DIFFERENT BASE LAYERS
    ///////////////////////////////////////////////////////////

        this.Aerial = L.tileLayer(this.mapURL1, {attribution: this.mapCopyright1});
        this.MapView = L.tileLayer(this.mapURL2, {attribution: this.mapCopyright2});
        this.ColorView = L.tileLayer(this.mapURL3, {attribution: this.mapCopyright3});

    ////////////////////////////////////////////////////////////
    //   INITIALIZING OVERLAYS
    ///////////////////////////////////////////////////////////

        this.ZipCodeLayer           = new L.LayerGroup(); // ZipCode Boundary for Chicago 
        this.AsthmaLayer            = new L.LayerGroup(); // Asthma Diagnostic Group AsthmaLayer
        this.DiabetesLayer          = new L.LayerGroup(); // Diabetes Diagnostic Group 
        this.SCDLayer               = new L.LayerGroup(); // Sickle Cell Diagnostic Group
        this.OtherLayer             = new L.LayerGroup(); // Other Diagnostic Group Layer
        this.CountyLayer            = new L.LayerGroup(); // Counties in Illinois 
        this.TotalAgesLayer         = new L.LayerGroup(); // Total Ages Layer
        this.UnderAgesLayer         = new L.LayerGroup(); // Under 25 Age Layer
        this.OverAgesLayer          = new L.LayerGroup(); // Over 25 Age Layer
        this.InPatientLayer         = new L.LayerGroup();
        this.OutPatientLayer        = new L.LayerGroup();
        this.NipsPatientLayer       = new L.LayerGroup();
    },
    ////////////////////////////////////////////////////////////
    //   FUNCTION CALL TO GET CURRENT WEATHER DATA
    ///////////////////////////////////////////////////////////
    //~ weatherDiv: function(){
//~ 
        //~ usweatherApp.updateOutsideTemp();
    //~ 
    //~ },
    addLayerInformation: function(view_type,group_type,age_group,encounter_group,diagnostic_group){
        if(view_type == 'ZIPCODES'){

            var radio_ages = $('input[name="radio_ages"]:checked').val();

            var radio_encounters = $('input[name="radio_encounters"]:checked').val();
            var ages ;
            var encounters;
            /////////////////
            ///
            /////////////////

            if(radio_ages == 'Total'){
                ages = "TOTAL"; 
            }
            else if (radio_ages == '< 25'){
                ages = "UNDER";
            }
            else if (radio_ages == '> 25'){
                ages = "ABOVE";
            }
            else {
                ages = "TOTAL";
            }



            if(group_type == 'AGE'){

            }
            else if(group_type == 'ENCOUNTER'){

            }
            else if(group_type == 'DIAGNOSTIC'){

            }

            var l_zipcode = this.zipcodeJson;
            // Showing Content from JSON FILE 
            l_zipcode.forEach(function(d) {
                //////
                //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
                //////

                    if( radio_encounters == "In Patient"){
                        encounters = "IP_encounters";
                        if(d.RecipientZip == t && d.Age == ages ){
                            content = '<P><B>ZipCode:</B>' 
                                        + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                        + d.IP_charges + '<br><B> IP Encounters: </B>'
                                        + d.IP_encounters
                                        + '</P>';
                        }
                    }   
                    else if (radio_encounters == "Out Patient"){
                        encounters = "OP_charges";
                        if(d.RecipientZip == t && d.Age == ages){
                            content = '<P><B>ZipCode:</B>' 
                                        + d.RecipientZip + '<br><B> OP Charges: </B>' 
                                        + d.IP_charges + '<br><B> OP Encounters: </B>'
                                        + d.OP_encounters
                                        + '</P>';
                    }
                    }
                    else if (radio_encounters == "NIPS"){
                        encounters = "NIPS_charges";
                        if(d.RecipientZip == t && d.Age == ages){
                            content = '<P><B>ZipCode:</B>' 
                                        + d.RecipientZip + + '<br><B> NIPS Charges: </B>' 
                                        + d.NIPS_charges + '<br><B> NIPS Encounters: </B>'
                                        + d.NIPS_encounters
                                        + '</P>';
                        }
                    }
                    else if (radio_encounters == "Emergency Department"){
                        encounters = "";
                        if(d.RecipientZip == t && d.Age == ages){
                            content = '<P><B>ZipCode:</B>' 
                                        + d.RecipientZip + '<br><B> ED Charges: </B>' 
                                        + d.IP_charges + '<br><B> ED Encounters: </B>'
                                        + d.IP_encounters
                                        + '</P>';
                        }
                    }
                    else {
                        encounters = "Total_Charges";
                        if(d.RecipientZip == t && d.Age == ages){
                            content = '<P><B>ZipCode:</B>' 
                                        + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                        + d.Total_Charges + '<br><B> Total Encounters: </B>'
                                        + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                        + '</P>';
                        }
                    }

            });

        }
    }
    ,
    ////////////////////////////////////////////////////////////
    //   ADDING BASE LAYERS
    ///////////////////////////////////////////////////////////
    resetLayers: function(){
        console.log("RESETTING LAYER");
        // Removing Each Layer 

        //this.map.removeLayer(this.ZipCodeLayer);
        //this.map.removeLayer(this.AsthmaLayer);
        //this.map.removeLayer(this.DiabetesLayer);
        //this.map.removeLayer(this.SCDLayer);
        //this.map.removeLayer(this.OtherLayer);
        // Resetting Layers
        this.ZipCodeLayer.clearLayers();
        this.AsthmaLayer.clearLayers();
        this.DiabetesLayer.clearLayers();
        this.SCDLayer.clearLayers();
        this.OtherLayer.clearLayers();
        this.TotalAgesLayer.clearLayers();
        this.UnderAgesLayer.clearLayers();
        this.OverAgesLayer.clearLayers();
        this.InPatientLayer.clearLayers();
        this.OutPatientLayer.clearLayers();
        this.NipsPatientLayer.clearLayers();

    },
    layerOverview: function (){


        this.baseLayers = {
            "ColorView": this.ColorView,
            "MapView": this.MapView,
            "Aerial": this.Aerial
        };
    ////////////////////////////////////////////////////////////
    //   DEFINING VARIOUS LAYERS TO SHOW ON MAP
    ///////////////////////////////////////////////////////////

        this.baseLayerOverview();

    },
    
    ////////////////////////////////////////////////////////////
    //   ADDING OVERLAYS TO BASE LAYERS
    ///////////////////////////////////////////////////////////
    baseLayerOverview: function(){

          this.overlayMaps = {
              
              //  "CTA Bus"               : this.CTATrackerLayer,
                "County-Illinois"       : this.CountyLayer,
                "ZipCode-Chicago"       : this.ZipCodeLayer,
                "Asthma"                : this.AsthmaLayer,
                "Diabetes"              : this.DiabetesLayer,
                "SCD"                   : this.SCDLayer,
                "Other"                 : this.OtherLayer
            };

            ////////////////////////////////////////////////////////////
            //   ADDING DIFFERENT CONTROLS TO THE MAP
            ///////////////////////////////////////////////////////////
            L.control.scale().addTo(this.map);
            //L.control.layers(this.baseLayers, this.overlayMaps, {position: 'bottomleft', collapsed: false}).addTo(this.map);
            //L.control.sidebar('sidebar-right', { position: 'right' }).addTo(this.map);

    },

    ////////////////////////////////////////////////////////////
    //   CLEARING DATA FROM MAP
    ///////////////////////////////////////////////////////////
    clearMapFunc: function(){
        // Removing Polygon
        if(this.Polygon!=null){
            this.map.removeLayer(this.Polygon);
        }
        if(this.PotHolesLayer!=null){
            this.PotHolesLayer.clearLayers(); 
        }
        if(this.AbandonLayer!=null){
            this.AbandonLayer.clearLayers(); 
        }
        if(this.StreetLightLayer!=null){
            this.StreetLightLayer.clearLayers(); 
        }
        if(this.DivvyStationLayer!=null){
            this.DivvyStationLayer.clearLayers(); 
        }
        if(this.RecentCrimeLayer!=null){
            this.RecentCrimeLayer.clearLayers(); 
        }
        if(this.RestPOILayer!=null){
            this.RestPOILayer.clearLayers(); 
        }
        if(this.RestaurantLayer!=null){
            this.RestaurantLayer.clearLayers(); 
        }
        if(this.CTATrackerLayer!=null){
            this.CTATrackerLayer.clearLayers(); 
        }
        // Removing Path
        d3.selectAll("path").remove();
		window.started = false;
       // console.log(this.markerArray[0]+ ' ' +this.markerArray.length);

        //~ if((this.markerArray).length >0){
            //~ for (var i = 0 ; i<=this.markerArray.length; i++){
                //~ this.map.removeLayer(this.markerArray[i]);
            //~ } 
        //~ }
        clearAllLayers();
        setTimeout(function() {
        d3.select(".leaflet-marker-pane").html(null);
        d3.select(".leaflet-shadow-pane").html(null);
        }, 500);

    },
    init: function(whereToRender){
    
    ////////////////////////////////////////////////////////////
    //   DEFINING MAP PARAMETERS AND ZOOM LEVEL AND VIEW
    ///////////////////////////////////////////////////////////

        this.map = L.map(whereToRender, {
            center: [41.867490, -87.633645],
            zoom: 12,
            layers: [this.MapView],
            zoomControl: true
            });

        // Calling the BaseLayer and Overlay Feature
        this.layerOverview();

        this.map._initPathRoot();  

    }
});

