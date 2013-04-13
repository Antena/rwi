var margin = {top: 20, right: 20, bottom: 40, left: 30},
  barChartWidth = 960 - margin.left - margin.right,
  barChartHeight = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
      .rangeRoundBands([0, barChartWidth], 0.1);

var y = d3.scale.linear()
      .rangeRound([barChartHeight, 0]);

var colorStack = d3.scale.ordinal()
    .range(["#798BD2", "#6D65A7", "#694584", "#6A2B66"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(10)
    .tickFormat(function (d) { return Math.round(d / 5); });

var formatComponents = d3.format("r");

var barchart = d3.select("#barchart").append("svg")
    .attr("width", barChartWidth + margin.left + margin.right)
    .attr("height", barChartHeight + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("../data/world-data.json", function (error, originalData) {

  d3.json("../data/data-summary-code.json", function (error, data) {
    colorStack.domain(d3.keys(data[0]).filter(function (key) {
      return key !== "Code" && key !== "Country Name" && key !== "notes" && key !== "rwi_region" && key !== "Ranking" && key !== "Composite Score" && key !== "resource";
    }));

    // colorStack.domain(["Institutional & Legal Setting","Reporting Practices","Safeguards & Quality Controls", "Enabling Environment"]);


console.log(colorStack);

  data.forEach(function (d) {
    var c0 = 0;
    d.Score = colorStack.domain().map(function (name) { return {name: name, c0: c0, c1: c0 += +d[name]}; });
    d.total = d.Score[d.Score.length - 1].c1;               
    //console.log(d.Score)
  });

 
  data.sort(function (a, b) { return b.total - a.total; });

  x.domain(data.map(function (d) { return d.Code; }));
  y.domain([0, d3.max(data, function (d) { return d.total; })]);

  barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barChartHeight + ")")
      .call(xAxis)
       .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)" 
                });

  barchart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 14)
      .attr("dy", ".15em")

  var country = barchart.selectAll(".country")
      .data(data)
    .enter().append("g")
      .attr("class", "stacked")
      .attr("transform", function (d) { return "translate(" + x(d.Code) + ",0)"; })
    .tooltip(function (d,i) {
                return {
                    cssClass: "RWITooltip",
                    type: "mouse",
                    pointerEvents:"all",
                    displacement: 

                      [0,-230]

                    ,
                    content: getTooltipStacked,
                    updateContent: function () {


                       var country = originalData.filter(function (d) { return originalData.iso3 == d.Code })[i];

                      if (country) {
                                var rankOrdinal = country.rwi_rank.toOrdinal();
                                document.getElementById("countryName").innerHTML = country.name;
                                document.getElementById("rankingPos").innerHTML = rankOrdinal;
                                document.getElementById("setTextIcon").innerHTML = country.resource;
                                document.getElementById("setIcon").innerHTML = " <span aria-hidden='true' class='icon-"+country.resource+"'></span>";
                                document.getElementById("get-score").innerHTML = country.rwi_score;
                                document.getElementById("get-instituional").innerHTML = country.rwi_institutional;
                                document.getElementById("get-reporting").innerHTML = country.rwi_reporting;
                                document.getElementById("get-safeguards").innerHTML = country.rwi_safeguard;
                                document.getElementById("get-environment").innerHTML = country.rwi_enabling;

                                }
                             $(".close").click(function (event) {
                              event.preventDefault();
                              $(this).closest(".RWITooltip").remove();
                            })
                    }
                    
                }
            });



  country.selectAll("rect")
      .data(function (d) { return d.Score; })

    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.c1); })
      .attr("height", function (d) { return y(d.c0) - y(d.c1); })
      .style("fill", function (d) { return colorStack(d.name); })
    
var legend = barchart.selectAll(".legend")
      .data(colorStack.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 50)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorStack);

  legend.append("text")
      .attr("x", width - 60)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) { return d; });

})

});