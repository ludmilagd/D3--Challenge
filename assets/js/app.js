var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight+20);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial axes values
var finalXaxis= "poverty"
var finalYaxis= "obesity";

// Update scale upon click on axis
function xScale(data,finalXaxis) {
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d[finalXaxis]) * 0.9,
    d3.max(data, d => d[finalXaxis]) * 1.1
  ])
  .range([0, width]);

return xLinearScale;  
}

// Update y-scale var upon click on axis
function yScale(data, finalYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[finalYaxis])-2,d3.max(data, d => d[finalYaxis])+2])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// functions used for updating circles group with a transition to
// new circles for x

function renderXCircles(circlesGroup, newXScale, finalXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[finalXaxis]))
    .attr("dx", d => newXScale(d[finalXaxis]));

  return circlesGroup;
}
// new circles for y
function renderYCircles(circlesGroup, newYScale, finalYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[finalYaxis]))
    .attr("dy", d => newYScale(d[finalYaxis])+5)

  return circlesGroup;
}

// Updating text location
function renderXText(circlesGroup, newXScale, finalXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[finalXaxis]));

  return circlesGroup;
}
function renderYText(circlesGroup, newYScale, finalYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[finalYaxis])+5)

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(finalXaxis, finalYaxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (finalXaxis === "poverty") {
    xlabel = "Poverty(%):";
  }
  else if (finalXaxis === "age") {
    xlabel = "Age:";
  }
  else if (finalXaxis === "income"){
      xlabel = "Household income $:"
  }

  if (finalYaxis === 'healthcare'){
      ylabel = "Health:"
  }
  else if (finalYaxis === 'obesity'){
      ylabel = "Obesity:"
  }
  else if (finalYaxis === 'smokes'){
      ylabel = "Smokes:"
  }

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .style("color", "darkblue")
  .style("background", 'white')
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .html(function(d) {
    return (`${d.state}<br>${xlabel} ${d[finalXaxis]}%<br>${ylabel} ${d[finalYaxis]}%`);
  });

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
  toolTip.show(data);
})
  // onmouseout event
.on("mouseout", function(data, index) {
toolTip.hide(data);
});

return circlesGroup;
}

// Import Data
d3.csv("assets/data/data.csv").then(function(data) {

  
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.povertyMoe = +d.povertyMoe;
      d.age = +d.age;
      d.ageMoe = +d.ageMoe;
      d.income = +d.income;
      d.incomeMoe = +d.incomeMoe;
      d.healthcare = +d.healthcare;
      d.healthcareLow = +d.healthcareLow;
      d.healthcareHigh = +d.healthcareHigh;
      d.obesity = +d.obesity;
      d.obesityLow = +d.obesityLow;
      d.obesityHigh = +d.obesityHigh;
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokesHigh = +d.smokesHigh;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(data, finalXaxis);

    var yLinearScale = yScale(data, finalYaxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      var yAxis = chartGroup.append("g")
      .call(leftAxis);

      var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("g");

      var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[finalXaxis]))
      .attr("cy", d => yLinearScale(d[finalYaxis]))
      .attr("r", 15)
      .classed('stateCircle', true);

      // append text inside circles
    var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[finalXaxis]))
    .attr("dy", d => yLinearScale(d[finalYaxis])+5) //to center the text in the circles
    .classed('stateText', true);

     // Create group for three x-axis labels
     var xlabelsGroup = chartGroup.append("g")
     .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
   var PovertyLabel = xlabelsGroup.append("text")
     .attr("x", 0)
     .attr("y", 20)
     .attr("value", "poverty") // value to grab for event listener
     .classed("active", true)
     .text("Poverty (%)");
 
   var AgeLabel = xlabelsGroup.append("text")
     .attr("x", 0)
     .attr("y", 40)
     .attr("value", "age") // value to grab for event listener
     .classed("inactive", true)
     .text("Age (Median)");

   var IncomeLabel = xlabelsGroup.append("text")
     .attr("x", 0)
     .attr("y", 60)
     .attr("value", "income") // value to grab for event listener
     .classed("inactive", true)
     .text("Income $ (Median)");
   
   // Create group for three y-axis labels
   var ylabelsGroup = chartGroup.append("g")
     .attr("transform", "rotate(-90)")
   
   var ObeseLabel = ylabelsGroup.append("text")
     .attr("y", -80)
     .attr("x", -(height/2))
     .attr("dy", "1em")
     .attr("value", "obesity") // value to grab for event listener
     .classed("inactive", true)
     .text("Obesity (%)");
 
   var SmokesLabel = ylabelsGroup.append("text")
     .attr("y", -60)
     .attr("x", -(height/2))
     .attr("dy", "1em")
     .attr("value", "smokes") // value to grab for event listener
     .classed("inactive", true)
     .text("Smokes (%)");

   var HealthLabel = ylabelsGroup.append("text")
     .attr("y", -40)
     .attr("x", -(height/2))
     .attr("dy", "1em")
     .attr("value", "healthcare") // value to grab for event listener
     .classed("active", true)
     .text("Without Healthcare (%)");

   // updateToolTip function above csv import
   circlesGroup = updateToolTip(finalXaxis, finalYaxis, circlesGroup);
 
   // x axis labels event listener
   xlabelsGroup.selectAll("text")
     .on("click", function() {
       // get value of selection
       var value = d3.select(this).attr("value");
       if (value !== finalXaxis) {
 
         // replaces finalXaxis with value
         finalXaxis = value;
 
         // console.log(finalXaxis)
 
         // functions here found above csv import
         // updates x scale for new data
         xLinearScale = xScale(data, finalXaxis);
 
         // updates x axis with transition
         xAxis = renderXAxes(xLinearScale, xAxis);
 
         // updates circles with new x values
         circles = renderXCircles(circles, xLinearScale, finalXaxis);

       //   updating text within circles
         circlesText = renderXText(circlesText, xLinearScale, finalXaxis)  
 
         // updates tooltips with new info
         circlesGroup = updateToolTip(finalXaxis, finalYaxis, circlesGroup);
 
         // changes classes to change bold text
         if (finalXaxis === "age") {
           AgeLabel
             .classed("active", true)
             .classed("inactive", false);
           PovertyLabel
             .classed("active", false)
             .classed("inactive", true);
           IncomeLabel
             .classed("active", false)
             .classed("inactive", true);
         }
         else if(finalXaxis === 'income'){
           IncomeLabel
             .classed("active", true)
             .classed("inactive", false);
           PovertyLabel
             .classed("active", false)
             .classed("inactive", true);
           AgeLabel
             .classed("active", false)
             .classed("inactive", true);
         }
         else {
           IncomeLabel
             .classed("active", false)
             .classed("inactive", true);
           AgeLabel
             .classed("active", false)
             .classed("inactive", true);
           PovertyLabel
             .classed("active", true)
             .classed("inactive", false);
         }
       }
     });

     // y axis labels event listener
   ylabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== finalYaxis) {

       // replaces finalYaxis with value
       finalYaxis = value;

       // updates y scale for new data
       yLinearScale = yScale(data, finalYaxis);

       // updates x axis with transition
       yAxis = renderYAxes(yLinearScale, yAxis);

       // updates circles with new y values
       circles = renderYCircles(circles, yLinearScale, finalYaxis);

       // update text within circles
       circlesText = renderYText(circlesText, yLinearScale, finalYaxis) 

       // updates tooltips with new info
       circlesGroup = updateToolTip(finalXaxis, finalYaxis, circlesGroup);

       // changes classes to change bold text
       if (finalYaxis === "obesity") {
         ObeseLabel
           .classed("active", true)
           .classed("inactive", false);
         SmokesLabel
           .classed("active", false)
           .classed("inactive", true);
         HealthLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else if(finalYaxis === 'smokes'){
         SmokesLabel
           .classed("active", true)
           .classed("inactive", false);
         HealthLabel
           .classed("active", false)
           .classed("inactive", true);
         ObeseLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else {
         HealthLabel
           .classed("active", true)
           .classed("inactive", false);
         SmokesLabel
           .classed("active", false)
           .classed("inactive", true);
         ObeseLabel
           .classed("active", false)
           .classed("inactive", true);
       }
     }
   });
});