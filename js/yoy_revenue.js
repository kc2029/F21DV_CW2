// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/kc2029/F21DV_CW2/main/resource/data/gamingIndustry.csv"
).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 70, right: 150, bottom: 70, left: 60 },
    width = 760 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  const svg = d3
    .select("#yoyBar")
    .append("svg")
    .attr("id", "yoyBar")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // Format the data
  const allGroup = [
    "Download Games",
    "Gaming Networks",
    "Mobile Games",
    "Online Games",
    "Total",
  ];

  //group data by "allGroup"
  const dataReady = allGroup.map(function (grpName) {
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: parseInt(d.year), value: parseFloat(d[grpName]) };
      }),
    };
  });

  // A color scale: one color for each group
  const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

  // Add X axis --> it is a date format
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => parseInt(d.year)))
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => parseFloat(d.Total))])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add the lines
  const line = d3
    .line()
    .x((d) => x(d.time))
    .y((d) => y(d.value));
  svg
    .selectAll(".line")
    .data(dataReady)
    .join("path")
    .attr("class", (d) => d.name.replace(/ /g, "_"))
    .attr("d", (d) => line(d.values))
    .attr("stroke", (d) => myColor(d.name))
    .style("stroke-width", 4)
    .style("fill", "none");

  //add the dots
  svg
    .selectAll(".dotGroup")
    .data(dataReady)
    .join("g")
    .attr("class", (d) => d.name.replace(/ /g, "_"))
    .style("fill", (d) => myColor(d.name))
    .selectAll(".dot")
    .data((d) => d.values)
    .join("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => y(d.value))
    .attr("r", 5)
    .attr("stroke", "white");

  const tooltip = d3
    .select("#page4")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "1px")
    .style("font-size", "12px")
    .style("height", "35px");

  // Add a legend at the end of each line
  svg
    .selectAll("myLabels")
    .data(dataReady)
    .join("g")
    .append("text")
    .datum((d) => {
      return { name: d.name, value: d.values[d.values.length - 1] };
    }) // keep only the last value of each time series
    .attr(
      "transform",
      (d) => `translate(${x(d.value.time)},${y(d.value.value)})`
    ) // Put the text at the position of the last point
    .attr("x", 12) // shift the text a bit more right
    .attr("y", (d) => (d.name === "Online Games" ? -20 : 0)) // move "Online Games" label up by 20px
    .text((d) => d.name)
    .style("fill", (d) => myColor(d.name))
    .style("font-size", 15)
    .attr("id", (d) => d.name.replaceAll(" ", "")) // assign unique id to each label
    .on("click", function (event, d) {
      // is the element currently visible?
      currentOpacity = d3
        .selectAll("." + d.name.replace(/ /g, "_"))
        .style("opacity");

      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d.name.replace(/ /g, "_"))
        .transition()
        .style("opacity", currentOpacity == 1 ? 0 : 1);

      // Hide/show the dots too
      d3.selectAll("." + d.name.replace(/ /g, "_") + "-dot")
        .transition()
        .style("opacity", currentOpacity == 1 ? 0 : 1);
    });

  // Select the "OnlineGames" label and move it up by 20px
  svg.select("#OnlineGames").attr("y", -10);

  // add Y label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("font-size", "20")
    .text("Billions($)");

  //add title
  svg
    .append("text")
    .attr("x", width - 190)
    .attr("y", margin.top / 2 - 70)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Year on year revenue");
});
