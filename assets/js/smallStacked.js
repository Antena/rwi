function stackbarchart(){

  
  
}

var newMargin = {top: 0, right: 0, bottom: 0, left: 0},
    smallStackedChartWidth = 420 - newMargin.left - newMargin.right,
    smallStackedChartHeight = 200 - newMargin.top - newMargin.bottom;

var smallStackedX = d3.scale.ordinal()
    .rangeRoundBands([0, smallStackedChartWidth], .1);

var smallStackedY = d3.scale.linear()
    .rangeRound([smallStackedChartHeight, 0]);

var colorSmallStack = d3.scale.ordinal()
    .range(["#798BD2", "#6D65A7", "#694584", "#6A2B66", "#A05D56"]);

  
var smallStackedChart = d3.select("#smallStacked").append("svg")
    .attr("width", smallStackedChartWidth + newMargin.left + newMargin.right)
    .attr("height", smallStackedChartHeight + newMargin.top + newMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + newMargin.left + "," + newMargin.top + ")");

d3.csv("../data/data-summary-code.csv", function(error, data) {
  colorSmallStack.domain(d3.keys(data[0]).filter(function(key) { return key !== "Code"; }));

  data.forEach(function(d) {
    var c0 = 0;
    d.Score = colorSmallStack.domain().map(function(name) { return {name: name, c0: c0, c1: c0 += +d[name]}; });
    d.total = d.Score[d.Score.length - 1].c1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  smallStackedX.domain(data.map(function(d) { return d.Code; }));
  smallStackedY.domain([0, d3.max(data, function(d) { return d.total; })]);

  var country = smallStackedChart.selectAll(".country")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + smallStackedX(d.Code) + ",0)"; })



  country.selectAll("rect")
      .data(function(d) { return d.Score; })

    .enter().append("rect")
      .attr("width", smallStackedX.rangeBand())
      .attr("y", function(d) { return smallStackedY(d.c1); })
      .attr("height", function(d) { return smallStackedY(d.c0) - smallStackedY(d.c1); })
      .style("fill", function(d) { return colorSmallStack(d.name); })
      .style("opacity", "0.5")
/*

      .style("opacity",function (d) {

        var country = data.filter(function(country) { return country.Code == "AF" })[0];
   
    
            if (country) {
                            
            } else {

            }


      })


*/
    


});
