function createSmallStacked(smallStacked) {

  
   console.log(smallStacked);


var smallMargin = {top: 10, right: 0, bottom: 10, left: 0},
    barChartWidth = 460 - smallMargin.right,
    barChartHeight = 200 - smallMargin.top - smallMargin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, barChartWidth], .1);

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
    .tickFormat(function(d) { return Math.round(d / 5); });
  
var formatComponents = d3.format("r");

var barchart = d3.select("#smallStacked").append("svg")
    .attr("width", barChartWidth + smallMargin.left + smallMargin.right)
    .attr("height", barChartHeight + smallMargin.top + smallMargin.bottom)
  .append("g")
    .attr("transform", "translate(-20," + smallMargin.top + ")");


d3.json("../data/data-summary-code.json", function(error, data) {
  colorStack.domain(d3.keys(data[0]).filter(function(key) { return key !== "Code" && key !== "Country Name" && key !== "rwi_region" && key !== "Ranking" && key !== "Composite Score" && key !== "notes" && key !== "resource"; }));


  data.forEach(function(d) {
    var c0 = 0;
    d.Score = colorStack.domain().map(function(name) { return {name: name, c0: c0, c1: c0 += +d[name]}; });
    d.total = d.Score[d.Score.length - 1].c1;               
    //console.log(d.total)
  });

 
  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Code; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  
   var country = barchart.selectAll(".country")
      .data(data)
    .enter().append("g")
     .attr("class", function(d) {
      

      var country = data.filter(function(country) { return smallStacked == d.Code })[0];

          if (country) {

            return "smallStacked selected";

          } else {
            
            return "smallStacked " + d.Code;

          }

      })


    //  .attr("class", "smallStacked " + smallStacked)
      .attr("transform", function(d) { return "translate(" + x(d.Code) + ",0)"; });



  country.selectAll("rect")
      .data(function(d) { return d.Score; })

    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.c1); })
      .attr("height", function(d) { return y(d.c0) - y(d.c1); })
      .style("fill", function(d) { return colorStack(d.name); })
    

})

}
