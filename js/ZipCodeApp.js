////////////////////////////////////////////////////////////////////
// by Sharad Tanwar for CRI- CHECK - Viz 
////////////////////////////////////////////////////////////////////

var ZipCodeApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.zipCodeFeatureJson = {};

        //
        // Initializing local variables
        //
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.busroutes1 = [];
        this.potWeekSelection = 0;
        this.potMonthSelection = 0;
        this.potWeekChicago = null;
        this.potMonthChicago = null;
        this.potPathWkVar = 0;
        this.potPathMnVar = 0;
        this.PotHoleJson = null;
        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1500;
        this.barCanvasHeight = 500;
        this.layer = null;
        /////
        this.zipCodePHPJson = null;

        this.barWidth = 0;
        this.barHeight = 0;
        
        this.svgBar = null;
        this.data2 = ZIPCODES;
        this.data4 = ZIPCODES;
        this.myTag = "";
        this.zipcodeJson ="";
        this.zipCodePHPJson = "";
        this.flag1 = 0;
        this.max_participants = 0;

    },
    /////////////////////////////////////////////////////////////

    startup: function (whereToRender)
    {
        //console.log('Inside Startup');
        this.myTag = whereToRender;
        this.updateScreen();
    },
    drawChart: function(){
            
       var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 900 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select("#barchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/chi_charges.csv", type, function(error, data) {
          x.domain(data.map(function(d) { return d.ZipCode; }));
          y.domain([0, d3.max(data, function(d) { return d.Total_Charges; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size","12pt")
            .text("Total Charges");

          svg.selectAll("bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.ZipCode); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.Total_Charges); })
              .attr("height", function(d) { return height - y(d.Total_Charges); });

        svg.selectAll(".chart-title")
           .data(data)
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-550)
           .attr("text-anchor","middle")
           .attr("font-family", "Lato")
           .attr("font-size","50pt")
           .text("Total Claims for Zipcodes");

});


        function type(d) {
          d.Total_Charges = +d.Total_Charges;
          return d;
        }
    },
    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawBarChart: function (data)
    {

        //console.log('Inside drawBarChart');
        //console.log(data);
        this.updateWindow();
        var width   = this.barCanvasWidth;
        var height  = this.barCanvasHeight;
        var svg     = this.svgBar;
        
        svg.selectAll("path").remove();
                
        var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();        
        
        var y = d3.scale.linear()
                .range([height, 0]);
                
        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6"]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("dx", ".71em")
        .style("text-anchor", "middle")
        .text("Charges");
         
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Charges");
         
        svg.selectAll("bar")
            .data(data.filter(function(d){
                return d.CommunityName === community && d.StationName === station;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.Day); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.No_Of_Bikes); })
            .attr("height", function(d) { return height - y(d.No_Of_Bikes); });
        
        svg.selectAll(".chart-title")
            .data(data.filter(function(d){
                return d.CommunityName === community && d.StationName === station;
            }))
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-200)
           .attr("text-anchor","middle")
           .attr("font-family", "sans-serif")
           .attr("font-size","20pt")
           .text("Bikes Distribution by Day of Week");
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function () {
        var xWin, yWin;
        
        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;
        
        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;
		document.getElementById('barchart').innerHTML = "";
        this.svgBar = d3.select(this.myTag).append("svg:svg")
        .attr("width", this.barWidth)
        .attr("height", this.barHeight)
        .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    

        //var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
        var potHoleChicago = 'https://data.cityofchicago.org/resource/7as2-ds3y.json?&$order=creation_date%20DESC';
        
        var potMonthSelection = this.potMonthSelection;
        var potWeekSelection = this.potWeekSelection;

        var potWeekChicago = 0;
        var potMonthChicago = 0;
        var self = this;
        //var PotHoleJson;
        d3.json(
            potHoleChicago, 
            function(err, response)
                {

                    var data1 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();

                        d.myDate = parseDate(d.creation_date);

                        d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                        if(d.daysAgo <8) {
                            return d;
                        }
                    });

                    potWeekChicago = data1.length; 

                    var data2 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();

                        d.myDate = parseDate(d.creation_date);

                        d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                        if (d.daysAgo <31) {
                            return d;   
                        }
                    }); 

                    potMonthChicago = data2.length;



                    var PotHoleJson = 
                    [
                        { "AreaFocus" : "SelectedArea", "Week" : mapContainer.potholesWeekSeen.length, "Month" : mapContainer.potholesMonthSeen.length},
                        {"AreaFocus": "Chicago", "Week" : potWeekChicago, "Month" : potMonthChicago }
                    ];

                    console.log('Pot Hole Data' +  potWeekSelection + potMonthSelection + potWeekChicago + potMonthChicago);

                    self.PotHoleJson = PotHoleJson;

                    //self.drawBarChart(PotHoleJson);

        });
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){

      this.updateData();
    },
    ////////////////////////////////////////////////////////////
    //   CALLBACK FUNCTION TO ADD TO POTHOLE LAYER
    ///////////////////////////////////////////////////////////

    makeCallback: function () {
        console.log("Inside Zip Code Callback");
        // Adding Zipcode Layer to Map 
        
        this.startup('#barchart');

    },
    /////////
    ////
    ////////
    getAsthmaColor: function(d){
        console.log(d);
        return d > 4000000 ? '#800026' :
               d > 3000000  ? '#BD0026' :
               d > 2000000  ? '#E31A1C' :
               d > 100000  ? '#FC4E2A' :
               d > 90000   ? '#FD8D3C' :
               d > 50000   ? '#FEB24C' :
                d > 1   ? '#FED976' :
                    '#FFFFFF';
    },
    /////////
    ////
    ////////
    styleAsthmaFunc: function(feature){
        var t = feature.properties.Description ;

        var content;
        var ages = $('input[name="radio_ages"]:checked').val();

        var radio_encounters = $('input[name="radio_encounters"]:checked').val();
        var diagnostic_group = $('input[name="diagnostic_group"]:checked').val();
        var ages ;
        var encounters;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        var content;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            //console.log("Radio Encounters : " + radio_encounters 

            if(diagnostic_group == "Asthma" && d.Asthma > 0){
                //console.log("Asthma");
                if(radio_encounters == "In Patient"){
                    encounters = "IP_encounters";
                    //console.log(encounters);
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content =  parseInt(d.IP_charges);
                        //console.log(content);
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (radio_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.OP_charges);
                    }
                }
                else if (radio_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.NIPS_charges) ;
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content =  parseInt(d.IP_charges );
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.Total_Charges);
                    }
                }
            }
            else if (diagnostic_group == "Diabetes"&& d.Diabetes > 0 ){
                if(radio_encounters == "In Patient"){
                    encounters = "IP_encounters";
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = parseInt(d.IP_charges);
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (radio_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.OP_charges);
                    }
                }
                else if (radio_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.NIPS_charges);
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = parseInt(d.IP_charges);
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content =  parseInt(d.Total_Charges) ;
                    }
                }
            }
            else if (diagnostic_group == "SCD" && d.SCD > 0 ){
                if(radio_encounters == "In Patient"){
                    encounters = "IP_encounters";
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = parseInt(d.IP_charges) ;
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (radio_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.OP_charges ;
                    }
                }
                else if (radio_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.NIPS_charges ;
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.IP_charges;
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.Total_Charges ;
                    }
                }
            }
            else if (diagnostic_group == "Other" && d.Other > 0){
                if(radio_encounters == "In Patient"){
                    encounters = "IP_encounters";
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = d.IP_charges;
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (radio_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.OP_charges;
                    }
                }
                else if (radio_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.NIPS_charges;
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = d.IP_charges ;
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content =  d.Total_Charges ;
                    }
                }
            }
            
           /* if(d.RecipientZip == t){
                content = '<P><B>ZipCode:</B>' 
                    + d.RecipientZip + '<br><B> Asthma Encounters: </B>' 
                    + d.Asthma
                    + '</P>';
            }
            */
        });
        return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: this.getAsthmaColor(content)
            };
    },
    /////////
    ////    
    ////////
    onEachAsthmaFeature: function(feature,layer){
        //console.log("on each Feature");
        //    if (feature.properties && feature.properties.popupContent) {

        var t = feature.properties.Description ;

        var content;
        var ages = $('input[name="radio_ages"]:checked').val();

        var radio_encounters = $('input[name="radio_encounters"]:checked').val();
        ///
        var nips_patient_encounters = $('input[name="nips_patient_encounters"]:checked').val();
        var in_patient_encounters = $('input[name="in_patient_encounters"]:checked').val();
        var out_patient_encounters = $('input[name="out_patient_encounters"]:checked').val();
        ////
        var diagnostic_group = $('input[name="diagnostic_group"]:checked').val();
        var ages ;
        var encounters;
        /////////////////
        ///
        /////////////////
/*
        if(radio_ages == 'TOTAL'){
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
*/
        

        var l_zipcode = this.zipcodeJson;
        // Showing Content from JSON FILE 
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            //console.log("Radio Encounters : " + radio_encounters 


            if(diagnostic_group == "Asthma" && d.Asthma > 0){
                var total_charges  = 0 ;
                var total_encounters = 0;
                if(nips_patient_encounters!=null){
                    total_charges = total_charges + parseInt(d.NIPS_charges);
                    total_encounters = total_encounters + parseInt(d.NIPS_encounters);
                }
                
                if (in_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.IP_charges);
                    total_encounters = total_encounters + parseInt(d.IP_encounters);
                }
                
                if(out_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.OP_charges);
                    total_encounters = total_encounters + parseInt(d.OP_encounters);
                }
                if(in_patient_encounters == "In Patient"){
                    encounters = "IP_encounters";
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip  + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Asthma Encounters:</th>"+
                                            "<td> " + d.Asthma + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";

                    }
                }   
                else if (out_patient_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" +  
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip  + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" +   
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Asthma Encounters:</th>"+
                                            "<td> " + d.Asthma + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (nips_patient_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" +  
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                         "<tr>" + 
                                                "<th>Charges:</th>"+
                                                "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Asthma Encounters:</th>"+
                                            "<td> " + d.Asthma + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ d.IP_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Asthma Encounters:</th>"+
                                            "<td> " + d.Asthma + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = '<P><B>ZipCode:</B>' 
                                    + d.RecipientZip + '<br><B> Total Charges:</B>' 
                                    + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                    + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                    + '</P>';
                    }
                }
            }
            else if (diagnostic_group == "Diabetes"&& d.Diabetes > 0 ){
                var total_charges  = 0 ;
                var total_encounters = 0;
                if(nips_patient_encounters!=null){
                    total_charges = total_charges + parseInt(d.NIPS_charges);
                    total_encounters = total_encounters + parseInt(d.NIPS_encounters);
                }
                
                if (in_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.IP_charges);
                    total_encounters = total_encounters + parseInt(d.IP_encounters);
                }
                
                if(out_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.OP_charges);
                    total_encounters = total_encounters + parseInt(d.OP_encounters);
                }  
                if(in_patient_encounters == "In Patient"){
                    
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Diabetes Encounters:</th>"+
                                            "<td> " + d.Diabetes + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (out_patient_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Diabetes Encounters:</th>"+
                                            "<td> " + d.Diabetes + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (nips_patient_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" +  
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                        "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Diabetes Encounters:</th>"+
                                            "<td> " + d.Diabetes + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + 
                                    "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" +
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Diabetes Encounters:</th>"+
                                            "<td> " + d.Diabetes + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = '<P><B>ZipCode:</B>' 
                                    + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                    + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                    + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                    + '</P>';
                    }
                }
            }
            else if (diagnostic_group == "SCD" && d.SCD > 0 ){
                var total_charges  = 0 ;
                var total_encounters = 0;
                if(nips_patient_encounters!=null){
                    total_charges = total_charges + parseInt(d.NIPS_charges);
                    total_encounters = total_encounters + parseInt(d.NIPS_encounters);
                }
                
                if (in_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.IP_charges);
                    total_encounters = total_encounters + parseInt(d.IP_encounters);
                }
                
                if(out_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.OP_charges);
                    total_encounters = total_encounters + parseInt(d.OP_encounters);
                }
                if(in_patient_encounters == "In Patient"){
                    
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Sickle Cell Encounters:</th>"+
                                            "<td> " + d.SCD + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (out_patient_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" +
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Sickle Cell Encounters:</th>"+
                                            "<td> " + d.SCD + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (nips_patient_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead> " + 
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Sickle Cell Encounters:</th>"+
                                            "<td> " + d.SCD + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ d.IP_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Sickle Cell Encounters:</th>"+
                                            "<td> " + d.SCD + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = '<P><B>ZipCode:</B>' 
                                    + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                    + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                    + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                    + '</P>';
                    }
                }
            }
            else if (diagnostic_group == "Other" && d.Other > 0){
                var total_charges  = 0 ;
                var total_encounters = 0;
                if(nips_patient_encounters!=null){
                    total_charges = total_charges + parseInt(d.NIPS_charges);
                    total_encounters = total_encounters + parseInt(d.NIPS_encounters);
                }
                
                if (in_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.IP_charges);
                    total_encounters = total_encounters + parseInt(d.IP_encounters);
                }
                
                if(out_patient_encounters !=null){
                    total_charges = total_charges + parseInt(d.OP_charges);
                    total_encounters = total_encounters + parseInt(d.OP_encounters);
                }
                if(in_patient_encounters == "In Patient"){
                    
                    if(d.RecipientZip == t && d.Age == ages ){
                        ////
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" +  "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Other Encounters:</th>"+
                                            "<td> " + d.Prematurity + d.Epilepsy + d.NewBorn + "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                   /* content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + d.IP_charges + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters 
                                + '</P>';
                    */
                    }
                }   
                else if (out_patient_encounters == "Out Patient"){
                    encounters = "OP_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" +  "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" +
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Other Encounters:</th>"+
                                            "<td> " + d.Prematurity + d.Epilepsy + d.NewBorn +  "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (nips_patient_encounters == "NIPS"){
                    encounters = "NIPS_charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th> ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" +  "<tr>" + 
                                            "<th>Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Other Encounters:</th>"+
                                            "<td> " + d.Prematurity + d.Epilepsy + d.NewBorn+ "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else if (radio_encounters == "Emergency Department"){
                    encounters = "";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = "<table class='table table-hover'>"+ 
                                    "<thead>" + 
                                        "<tr>" + 
                                            "<th>ZipCode :</th>"+
                                            "<td>" + d.RecipientZip + "</td>"+
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>" + "<tr>" + 
                                            "<th>ED Charges:</th>"+
                                            "<td>" + numeral(total_charges).format('$0,0.00')  + "</td>"+
                                        "</tr>" + 
                                        "<tr>" + 
                                        "<th>ED Encounters:</th>"+
                                            "<td>"+ total_encounters +"</td>" + 
                                        "</tr>"+
                                        "<tr>" + 
                                        "<th>Ages</th>"+
                                            "<td>" + d.Age + " 25</td>" + 
                                        "</tr>" +                                    
                                        "<tr>" + 
                                        "<th>Other Encounters:</th>"+
                                            "<td> " + d.Prematurity + d.Epilepsy + d.NewBorn+ "</td>"
                                        "</tr>" +
                                    "</tbody>" + 
                                "</table>";
                    }
                }
                else {
                    encounters = "Total_Charges";
                    if(d.RecipientZip == t && d.Age == ages){
                        content = '<P><B>ZipCode:</B>' 
                                    + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                    + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                    + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                    + '</P>';
                    }
                }
            }
            
           /* if(d.RecipientZip == t){
                content = '<P><B>ZipCode:</B>' 
                    + d.RecipientZip + '<br><B> Asthma Encounters: </B>' 
                    + d.Asthma
                    + '</P>';
            }
            */
        });

        //console.log("Content :" + content);

        if (feature.properties && feature.properties.Description) {
            layer.bindPopup(content);
        }
        /*
        layer.on({
        mouseover: this.highlightFeatureFunc,
        mouseout: this.resetHighlightFunc
          //  click : this.onClickFunc
        });
        */
    },
    /////////
    ////
    ////////    
    zipAsthmaFunc: function(){
        //console.log("Inside Zip Feature Func");
        //L.geoJson(ZIPCODE).addTo(mapContainer.ZipCodeLayer);
        this.geoAsthmaJson = L.geoJson(ZIPCODES, 
                    { 
                        polygonToLayer: function (feature, latlng) {
                            
                           /* var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B> Reporting Date : <BR></B>' 
                                        + d.myDate + '<br><B> Status: </B>' 
                                        + d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
                                        + d.status_message +  '</P>';
                            */
                            var popup = L.popup().setContent("content");

                            var oldLeafIcon = L.Icon.extend({
                                options: {
                                    iconSize:     [50, 50],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [12, 25],
                                    shadowAnchor: [4, 62],
                                    popupAnchor:  [-3, -40],
                                    opacity : 0.2
                                }
                            });

                            var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
                     //   var marker = L.marker(latlng,{icon: olderIcon});
                      //      marker.bindPopup("content");
                       //     return marker;  
                    },
                   // onEachFeature : this.onEachFeatureFunc,
                    style : this.styleAsthmaFunc,
                    onEachFeature : this.onEachAsthmaFeature
                }).addTo(mapContainer.AsthmaLayer);       
    },
    /////////
    ////
    ////////
    getDiabetesColor: function(d){
        return d > 4000000 ? '#800026' :
               d > 3000000  ? '#BD0026' :
               d > 2000000  ? '#E31A1C' :
               d > 100000  ? '#FC4E2A' :
               d > 90000   ? '#FD8D3C' :
               d > 50000   ? '#FEB24C' :
               d > 1   ? '#FED976' :
                    '#FFFFFF';
    },
    /////////
    ////
    ////////
    styleDiabetesFunc: function(feature){
        var t = feature.properties.Description ;

        var content;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if(d.RecipientZip == t && d.Diabetes > 0){
                content = d.Total_Charges;
            }

        });
        return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: this.getDiabetesColor(content)
            };
    },
    /////////
    ////    
    ////////
    onEachDiabetesFeature: function(feature,layer){
        //console.log("on each Feature");
        //    if (feature.properties && feature.properties.popupContent) {

        var t = feature.properties.Description ;

        var content;
        var ages = $('input[name="radio_ages"]:checked').val();

        var radio_encounters = $('input[name="radio_encounters"]:checked').val();
        var ages ;
        var encounters;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
          //  console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if( radio_encounters == "In Patient"){
                encounters = "IP_encounters";
                if(d.RecipientZip == t && d.Age == ages ){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }   
            else if (radio_encounters == "Out Patient"){
                encounters = "OP_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> OP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> OP Encounters: </B>'
                                + d.OP_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "NIPS"){
                encounters = "NIPS_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> NIPS Charges: </B>' 
                                + numeral(d.NIPS_charges).format('$0,0.00')  + '<br><B> NIPS Encounters: </B>'
                                + d.NIPS_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "Emergency Department"){
                encounters = "";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> ED Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> ED Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }
            else {
                encounters = "Total_Charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                + '</P>';
                }
            }

        });

        //console.log("Content :" + content);

        if (feature.properties && feature.properties.Description) {
            layer.bindPopup(content);
        }

        layer.on({
        mouseover: this.highlightFeatureFunc,
        mouseout: this.resetHighlightFunc
          //  click : this.onClickFunc
        });
    },
    /////////
    ////
    ////////
    zipDiabetesFunc : function(){
        //console.log("Inside Zip Diabetes Func");
        //L.geoJson(ZIPCODE).addTo(mapContainer.ZipCodeLayer);
        this.geoAsthmaJson = L.geoJson(ZIPCODES, 
                    { 
                        polygonToLayer: function (feature, latlng) {
                            
                           /* var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B> Reporting Date : <BR></B>' 
                                        + d.myDate + '<br><B> Status: </B>' 
                                        + d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
                                        + d.status_message +  '</P>';
                            */
                            var popup = L.popup().setContent("content");

                            var oldLeafIcon = L.Icon.extend({
                                options: {
                                    iconSize:     [50, 50],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [12, 25],
                                    shadowAnchor: [4, 62],
                                    popupAnchor:  [-3, -40],
                                    opacity : 0.2
                                }
                            });

                            var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
                     //   var marker = L.marker(latlng,{icon: olderIcon});
                      //      marker.bindPopup("content");
                       //     return marker;  
                    },
                    onEachFeature : this.onEachDiabetesFeature,
                    style : this.styleDiabetesFunc
                }).addTo(mapContainer.DiabetesLayer);  
    },
    /////////
    ////
    ////////
    getSCDColor: function(d){
        return d > 4000000 ? '#800026' :
               d > 3000000  ? '#BD0026' :
               d > 2000000  ? '#E31A1C' :
               d > 100000  ? '#FC4E2A' :
               d > 90000   ? '#FD8D3C' :
               d > 50000   ? '#FEB24C' :
                d > 1   ? '#FED976' :
                    '#FFFFFF';
    },
    /////////
    ////
    ////////
    styleSCDFunc: function(feature){
        var t = feature.properties.Description ;

        var content;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if(d.RecipientZip == t && d.SCD > 0){
                content = d.Total_Charges;
            }

        });
        return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: this.getSCDColor(content)
            };
    },
    /////////
    ////    
    ////////
    onEachSCDFeature: function(feature,layer){
        //console.log("on each Feature");
        //    if (feature.properties && feature.properties.popupContent) {

        var t = feature.properties.Description ;

        var content;
        var ages = $('input[name="radio_ages"]:checked').val();

        var radio_encounters = $('input[name="radio_encounters"]:checked').val();
        var ages ;
        var encounters;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if( radio_encounters == "In Patient"){
                encounters = "IP_encounters";
                if(d.RecipientZip == t && d.Age == ages ){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }   
            else if (radio_encounters == "Out Patient"){
                encounters = "OP_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> OP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> OP Encounters: </B>'
                                + d.OP_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "NIPS"){
                encounters = "NIPS_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> NIPS Charges: </B>' 
                                + numeral(d.NIPS_charges).format('$0,0.00')  + '<br><B> NIPS Encounters: </B>'
                                + d.NIPS_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "Emergency Department"){
                encounters = "";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> ED Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> ED Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }
            else {
                encounters = "Total_Charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                + numeral(d.Total_Charges).format('$0,0.00')  + '<br><B> Total Encounters: </B>'
                                + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                + '</P>';
                }
            }

        });

        //console.log("Content :" + content);

        if (feature.properties && feature.properties.Description) {
            layer.bindPopup(content);
        }
/*
        layer.on({
        mouseover: this.highlightFeatureFunc,
        mouseout: this.resetHighlightFunc
          //  click : this.onClickFunc
        });
*/
    },
    /////////
    ////
    ////////
    zipSCDFunc: function(){
        console.log("Inside Zip Diabetes Func");
        //L.geoJson(ZIPCODE).addTo(mapContainer.ZipCodeLayer);
        this.geoAsthmaJson = L.geoJson(ZIPCODES, 
                    { 
                        polygonToLayer: function (feature, latlng) {
                            
                           /* var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B> Reporting Date : <BR></B>' 
                                        + d.myDate + '<br><B> Status: </B>' 
                                        + d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
                                        + d.status_message +  '</P>';
                            */
                            var popup = L.popup().setContent("content");

                            var oldLeafIcon = L.Icon.extend({
                                options: {
                                    iconSize:     [50, 50],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [12, 25],
                                    shadowAnchor: [4, 62],
                                    popupAnchor:  [-3, -40],
                                    opacity : 0.2
                                }
                            });

                            var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
                     //   var marker = L.marker(latlng,{icon: olderIcon});
                      //      marker.bindPopup("content");
                       //     return marker;  
                    },
                   // onEachFeature : this.onEachFeatureFunc,
                    style : this.styleSCDFunc
                }).addTo(mapContainer.SCDLayer);  
    },
    /////////
    ////
    ////////
    getOtherColor: function(d){
        return d > 4000000 ? '#800026' :
               d > 3000000  ? '#BD0026' :
               d > 2000000  ? '#E31A1C' :
               d > 100000  ? '#FC4E2A' :
               d > 90000   ? '#FD8D3C' :
               d > 50000   ? '#FEB24C' :
               d > 1   ? '#FED976' :
                    '#FFFFFF';
    },
    /////////
    ////
    ////////
    styleOtherFunc: function(feature){
        var t = feature.properties.Description ;

        var content;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if(d.RecipientZip == t && (d.Prematurity > 0 || d.Epilepsy > 0 || d.NewBorn > 0 )){
                content = d.Total_Charges;
            }
            else {
                content = 0;
            }

        });
        return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: this.getOtherColor(content)
            };
    },
    /////////
    ////    
    ////////
    onEachOtherFeature: function(feature,layer){
        //console.log("on each Feature");
        //    if (feature.properties && feature.properties.popupContent) {

        var t = feature.properties.Description ;

        var content;
        var ages = $('input[name="radio_ages"]:checked').val();

        var radio_encounters = $('input[name="radio_encounters"]:checked').val();
        var ages ;
        var encounters;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if( radio_encounters == "In Patient"){
                encounters = "IP_encounters";
                if(d.RecipientZip == t && d.Age == ages ){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> IP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> IP Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }   
            else if (radio_encounters == "Out Patient"){
                encounters = "OP_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> OP Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> OP Encounters: </B>'
                                + d.OP_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "NIPS"){
                encounters = "NIPS_charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> NIPS Charges: </B>' 
                                + numeral(d.NIPS_charges).format('$0,0.00')  + '<br><B> NIPS Encounters: </B>'
                                + d.NIPS_encounters
                                + '</P>';
                }
            }
            else if (radio_encounters == "Emergency Department"){
                encounters = "";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> ED Charges: </B>' 
                                + numeral(d.IP_charges).format('$0,0.00')  + '<br><B> ED Encounters: </B>'
                                + d.IP_encounters
                                + '</P>';
                }
            }
            else {
                encounters = "Total_Charges";
                if(d.RecipientZip == t && d.Age == ages){
                    content = '<P><B>ZipCode:</B>' 
                                + d.RecipientZip + '<br><B> Total Charges: </B>' 
                                + numeral(d.Total_Charges).format('$0,0.00') + '<br><B> Total Encounters: </B>'
                                + (d.IP_encounters + d.OP_encounters + d.NIPS_encounters)
                                + '</P>';
                }
            }

        });

        //console.log("Content :" + content);

        if (feature.properties && feature.properties.Description) {
            layer.bindPopup(content);
        }
        /*
        layer.on({
        mouseover: this.highlightFeatureFunc,
        mouseout: this.resetHighlightFunc
          //  click : this.onClickFunc
        });
        */
    },
    /////////
    ////
    ////////
    zipOtherFunc: function(){
        console.log("Inside Zip Feature Func");
        //L.geoJson(ZIPCODE).addTo(mapContainer.ZipCodeLayer);
        this.geoJson = L.geoJson(ZIPCODES, 
                    { 
                        polygonToLayer: function (feature, latlng) {
                            
                            /* var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B> Reporting Date : <BR></B>' 
                                        + d.myDate + '<br><B> Status: </B>' 
                                        + d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
                                        + d.status_message +  '</P>';
                            */
                            var popup = L.popup().setContent("content");

                            var oldLeafIcon = L.Icon.extend({
                                options: {
                                    iconSize:     [50, 50],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [12, 25],
                                    shadowAnchor: [4, 62],
                                    popupAnchor:  [-3, -40],
                                    opacity : 0.2
                                }
                            });

                            var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
                     //   var marker = L.marker(latlng,{icon: olderIcon});
                      //      marker.bindPopup("content");
                       //     return marker;  
                    },
                    style : this.styleOtherFunc,
                    onEachFeature : this.onEachOtherFeature
                }).addTo(mapContainer.OtherLayer);
    },
    ////
    // Create Legends for Each Layer call for each Layer
    ///
    createAsthmaLegends: function(){

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                        legendgrades = [4000000,3000000,2000000, 100000, 90000, 50000, -1],
                        labels = [],from, to;
            labels.push('<b> Selected Total Charges </b>');
            for (var i = 0; i < legendgrades.length; i++) {
                /////////////////////////
                //
                /////////////////////////
                from = legendgrades[i];
                to = legendgrades[i + 1];

                if (from !=0){ 
                    var color =  from  > 4000000 ? '#800026' :
                                from > 3000000  ? '#BD0026' :
                                from > 2000000  ? '#E31A1C' :
                                from > 100000 ? '#FC4E2A' :
                                from > 90000   ? '#FD8D3C' :
                                from > 50000    ? '#FEB24C' :
                                from > 1 ? '#FED976' :
                                          '#FFFFFF';

                    labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (numeral(from+1).format('($ 0.00 a)')) + (numeral(to).format('($ 0.00 a)') ? '&ndash;' + numeral(to).format('($ 0.00 a)') : '+'));
                }
                else {
                    
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1   ? '#FED976' :
                                                  '#FFFFFF';
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (numeral(from).format('($ 0.00 a)')) + (to ? '&ndash;' + to : '+'));
                }

            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(mapContainer.map);
    },
    createDiabetesLegends: function(){

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                        legendgrades = [4000000,3000000,2000000, 100000, 90000, 50000, -1],
                        labels = [],from, to;
            labels.push('<b> Diabetes Total Charges </b>');
            for (var i = 0; i < legendgrades.length; i++) {
                /////////////////////////
                //
                /////////////////////////
                from = legendgrades[i];
                to = legendgrades[i + 1];

                if (from !=0){ 
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1   ? '#FED976' :
                                                  '#FFFFFF';

                    labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from+1) + (to ? '&ndash;' + to : '+'));
                }
                else {
                    
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1   ? '#FED976' :
                                                  '#FFFFFF';
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from) + (to ? '&ndash;' + to : '+'));
                }

            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(mapContainer.map);
    },
    createSCDLegends: function(){

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                        legendgrades = [4000000,3000000,2000000, 100000, 90000, 50000, -1],
                        labels = [],from, to;

            labels.push('<b> SCD Total Charges </b>');

            for (var i = 0; i < legendgrades.length; i++) {
                /////////////////////////
                //
                /////////////////////////
                from = legendgrades[i];
                to = legendgrades[i + 1];

                if (from !=0){ 
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1  ? '#FED976' :
                                                  '#FFFFFF';

                    labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from+1) + (to ? '&ndash;' + to : '+'));
                }
                else {
                    
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1   ? '#FED976' :
                                                  '#FFFFFF';
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from) + (to ? '&ndash;' + to : '+'));
                }

            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(mapContainer.map);
/*
        this._div = L.DomUtil.create('div', 'info'); 
        this
        this.update();
        return this._div;
        */
    },
    createOtherLegends: function(){

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                        legendgrades = [4000000,3000000,2000000, 100000, 90000, 50000, -1],
                        labels = [],from, to;

            labels.push('<b> Other Total Charges </b>');

            for (var i = 0; i < legendgrades.length; i++) {
                /////////////////////////
                //
                /////////////////////////
                from = legendgrades[i];
                to = legendgrades[i + 1];

                if (from !=0){ 
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1  ? '#FED976' :
                                                  '#FFFFFF';

                    labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from+1) + (to ? '&ndash;' + to : '+'));
                }
                else {
                    
                    var color =  from  > 4000000 ? '#800026' :
                                        from > 3000000  ? '#BD0026' :
                                        from > 2000000  ? '#E31A1C' :
                                        from > 100000  ? '#FC4E2A' :
                                        from > 90000   ? '#FD8D3C' :
                                        from > 50000   ? '#FEB24C' :
                                        from > 1   ? '#FED976' :
                                                  '#FFFFFF';
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from) + (to ? '&ndash;' + to : '+'));
                }

            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(mapContainer.map);
/*
        this._div = L.DomUtil.create('div', 'info'); 
        this
        this.update();
        return this._div;
        */
    },
    createTotalLegends: function(){

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),

                       // legendgrades = [200,150,120, 80, 40, 20, -1],
                       //legendgrades = [220,150,120,80,40,20 , -1 ],
                       //legendgrades = [99,300,250,200,150,100 , -1 ],
                     legendgrades = [389,300,200,150,100,50 , 0 ],
                    // legendgrades = [29,26,16,11,6,3,0 ],
                        labels = [],from, to;

            labels.push('<b> Total(IP + OP) Encounters Per ZipCodes </b>');
           /* labels.push(
                    '<i style="background:' + '#800026' + '"></i> ' +
                        (2) + (1 ? '&ndash;' + 1 : '+'));
           
            labels.push(
                    '<i style="background:' + '#FFFFFF' + '"></i> ' +
                        (0) + (null ? '&ndash;' + null : '+')); 
*/
            for (var i = 0; i < legendgrades.length; i++) {
                /////////////////////////
                //
                /////////////////////////
                from = legendgrades[i];
                to = legendgrades[i + 1];

                if (from !=0){ 
                    var color =     
                                // from > 94  ? '#800026' :
                                from > 300   ? '#800026': 
                                from > 200   ? '#BD0026'  :
                                from > 150 ? '#E31A1C' :
                                from > 100 ? '#FC4E2A' :
                                from > 50 ? '#FEB24C' : 
                                from > 0 ?  '#FED976' :
                                                  '#FFFFFF';
                                                 

                     /*  var color =     
                                // from > 94  ? '#800026' :
                                from > 26   ? '#800026': 
                                from > 16   ? '#BD0026'  :
                                from > 11 ? '#E31A1C' :
                                from > 6 ? '#FC4E2A' :
                                from > 3 ? '#FEB24C' : 
                                from > 0 ?  '#FED976' :
                                                  '#FFFFFF'; */
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from) + ((to+1) ? '&ndash;' + (to+1): '+'));
                }
                else {
                    var color =     
                                // from > 94  ? '#800026' :
                                from > 300   ? '#800026': 
                                from > 200   ? '#BD0026'  :
                                from > 150 ? '#E31A1C' :
                                from > 100 ? '#FC4E2A' :
                                from > 50 ? '#FEB24C' : 
                                from > 0 ?  '#FED976' :
                                                  '#FFFFFF';
                     labels.push(
                    '<i style="background:' + color + '"></i> ' +
                        (from) + (to ? '&ndash;' + (to+1)  : '+'));
                }

            }
            
            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(mapContainer.map);
    },
    /////////
    ////
    ////////
    highlightFeature: function(e){
        console.log("HighLightFunc");
       // this.layer = ;

        e.target.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

    },
    /////////
    ////
    ////////
    resetHighlight: function(e){
        console.log("resetHighlight");
        this.geojson.resetStyle(this.layer);
    },
    /////////
    ////
    ////////
    onClickFunc: function(e){
        console.log("OnClickFunc");
    },
    onEachFeature: function(feature,layer){
        //console.log(feature.geometry.geometries);
        //console.log("on each Feature");
        //    if (feature.properties && feature.properties.popupContent) {


        var t = feature.properties.Description ;

        var content;
      /*  var latlng = layer.getBounds().getCenter();
        //console.log("getCenter"  + layer.getBounds().getCenter());

         var oldLeafIcon = L.Icon.extend({
                                options: {
                                    iconSize:     [50, 50],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [12, 25],
                                    shadowAnchor: [4, 62],
                                    popupAnchor:  [-3, -40],
                                    opacity : 0.2
                                }
                            });
        var marker = L.marker(latlng);
        marker.addTo(layer).bindPopup(t);
        */
        //var label = new mapContainer.map.Label();
        //label.setContent("static label")
        //label.setLatLng(layer.getBounds().getCenter())
        //layer.showLabel(label);
        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
           // console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip + "d.Total_Charges" + d.Total_Charges);
            //////

            if(d.RecipientZip == t){
                /*content = "<table border=1><tr><th colspan=2 bgcolor=#99CCFF font-size><b>" 
                                            + d.RecipientZip 
                                            + "</th></tr><tr></tr><tr><td>Total Charges:" + "</td><td>"
                                            + d.Total_Charges+"</td></tr><tr><td> Total Participants</td><td>" 
                                            + d.Total_Participants+ "</td></tr><tr><td> Medication Cost</td><td>" 
                                            + d.Medication_Cost+ "</td></tr><tr><td>Asthma </td><td>"
                                            + d.Asthma+"</td></tr><tr><td>Diabetes</td><td>"
                                            + d.Diabetes + "</td></tr><tr><td>Sickle Cell<td>"
                                            + d.SCD+ "</td></tr><tr><td>Other Diseases</td><td>"
                                            + (d.Prematurity + d.Epilepsy + d.NewBorn)+"</td></tr></table>";*/
                                            
                content = "<table class='table table-hover'>"+ 
                                "<thead>" + 
                                    "<tr>" + 
                                        "<th>Total Charges : </th>"+
                                        "<td>" + numeral(d.Total_Charges).format('$0,0.00') + " </td>"+
                                    "</tr>" + 
                                "</thead>" + 
                                "<tbody>" + 
                                    "<tr>" + 
                                    "<th>Total Participants</th>"+
                                        "<td>"+ d.Total_Participants +"</td>"  + 
                                    "</tr>"+
                                "</tbody>" + 
                            "</table>";
            }

        });

        //console.log("Content :" + content);

        if (feature.properties && feature.properties.Description) {
            layer.bindPopup(content);
        }

/*
        layer.on({
        mouseover: this.highlightFeatureFunc,
        mouseout: this.resetHighlightFunc
          //  click : this.onClickFunc
        });
*/
    },
    /////////
    ////
    ////////
    getTotalColor: function(d){
      /*  return d > 220   ? '#800026' :
               d > 150   ? '#BD0026': 
               d > 120 ? '#E31A1C': 
               d > 80 ? '#FC4E2A':
               d > 40 ? '#FD8D3C': 
               d > 20 ? '#FEB24C': 
               d > 1   ? '#FED976' :
                    '#FFFFFF';
                    */
                return d > 300   ? '#800026': 
                                d > 200   ? '#BD0026'  :
                                d > 150 ? '#E31A1C' :
                                d > 100 ? '#FC4E2A' :
                                d > 50 ? '#FEB24C' : 
                                d > 0 ?  '#FED976' :
                                                  '#FFFFFF';
                                                  
       /* return d > 0   ? '#800026' :
                    '#FFFFFF';*/


                  
    },
    /////////
    ////
    ////////
    styleTotalFunc: function(feature){
        var t = feature.properties.Description ;

        var content;

        // Showing Content from JSON FILE 
        var l_zipcode = this.zipcodeJson;
        l_zipcode.forEach(function(d) {
            //////
            //console.log("t :" + t + "d.RecipientZip  " + d.RecipientZip);
            //////
            if(d.RecipientZip == t){
                content = d.Total_Participants;
            }

        });
        return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor:  this.getTotalColor(content)
            };
    },
    zipFeatureFunc: function(){
        //console.log("Inside Zip Feature Func");
        //L.geoJson(ZIPCODE).addTo(mapContainer.ZipCodeLayer);

       // var D2 = ZIPCODES;
       if( this.flag1 == 0){
            /////
            this.data2 = ZIPCODES;
            this.data4 = ZIPMARKERS;
            /////
            ZIPCODES.features.forEach(function(d,i){
            //
                if(d.geometry.geometries){
                    d.geometry.geometries.splice(0,1);
                    return d;
                }
            });

            //var D4 = ZIPCODES;


            ZIPMARKERS.features.forEach(function(d,i){
            //
                if(d.geometry.geometries){
                    d.geometry.geometries.splice(1,1);
                    return d;
                }
            });

            this.flag1 =1  ; 
            this.data2 = ZIPCODES;
            this.data4 = ZIPMARKERS;
       }


        // console.log("data2" + this.data2);
        // console.log("data4" + this.data4);
        this.geoJson = L.geoJson(this.data2, 
                    {   
                            style : this.styleTotalFunc,
                         onEachFeature : this.onEachFeatureFunc
                    }).addTo(mapContainer.ZipCodeLayer);
                //console.log("data2" + ZIPCODES);


        // Commenting to show map without markers
        /*
        this.GEOJSON = L.geoJson(this.data4,{ 
                        pointToLayer: function (feature, latlng) {
                            var content = feature.properties.Description;
                            var marker = L.marker(latlng).bindLabel(content,{ noHide : true});
                           // 
                            
                            //marker.bindPopup(content);
                            //marker.bindPopup(content).bindLabel("Sweet Label");
                            return marker;  
                        }
                    }).addTo(mapContainer.ZipCodeLayer);
        */


        toggleLayer('ZipCodeLayer');                       
    },
    assignPHP: function(response){
        //console.log("Inside assignPHP");
        this.zipcodeJson = response;

    },

    /////////
    ////
    ////////
    callzipPHP: function(mode){
    // Ajax call for PHP?? 
        console.log("Inside callzipPHP");

        if(mode== 'UIHP'){
            console.log("MODE : UIHP" );
            var phpFile = "./data/UIHP_ZipCode.php";
        }
        else if (mode == 'ELIGIBLE') {
            console.log("MODE : ELIGIBLE" );
            var phpFile = "./data/Eligible_ZipCode.php";
        }
        else if (mode == 'ENROLLED'){
            console.log("MODE : ENROLLED" );
           var phpFile = "./data/ENROLLED_ZipCode.php";
        }
        var zipCodeData;
        var self = this;
        d3.json(phpFile,function(data){

            console.log("Inside php File data :" + data);
            zipCodeData = data;
            self.zipCodePHPJson = zipCodeData;
            self.assignPHP(data);
            //self.makeCallbackFunc(response,update);
        });

        //`this.zipCodePHPJson = zipCodeData;
        //console.log(this.zipCodePHPJson);
    },
    ////////////////////////////////////////////////////////
    //  INITIALIZE FUNCTION FOR POTHOLE
    ///////////////////////////////////////////////////////

    init: function () {

        //console.log("Inside Init for ZipCode");

        //this.zipFeatureFunc;
        this.makeCallbackFunc = this.makeCallback.bind(this);
        this.assignPHP = this.assignPHP.bind(this);

        //binding so that function can be used inside another function
        this.onEachFeatureFunc = this.onEachFeature.bind(this);
        this.highlightFeatureFunc = this.highlightFeature.bind(this);
        this.resetHighlightFunc = this.resetHighlight.bind(this);
        this.onClickFunc = this.onClickFunc.bind(this);
        this.styleTotalFunc = this.styleTotalFunc.bind(this);
        this.getTotalColor = this.getTotalColor.bind(this);

        //Asthma
        this.onEachAsthmaFeature    = this.onEachAsthmaFeature.bind(this);
        this.styleAsthmaFunc        = this.styleAsthmaFunc.bind(this);
        this.getAsthmaColor         = this.getAsthmaColor.bind(this);
        //Diabetes
        this.onEachDiabetesFeature  = this.onEachDiabetesFeature.bind(this);
        this.styleDiabetesFunc      = this.styleAsthmaFunc.bind(this);
        this.getDiabetesColor       = this.getDiabetesColor.bind(this);
        //SCD
        this.onEachSCDFeature       = this.onEachSCDFeature.bind(this);
        this.styleSCDFunc           = this.styleSCDFunc.bind(this);
        this.getSCDColor            = this.getSCDColor.bind(this);
        //Other
        this.onEachOtherFeature     = this.onEachOtherFeature.bind(this); 
        this.styleOtherFunc         = this.styleOtherFunc.bind(this);
        this.getOtherColor          = this.getOtherColor.bind(this);

        //this.loadInIcons();
        //this.updateOutsideTemp();
       // this.iconCreationFunc();
    }

});
