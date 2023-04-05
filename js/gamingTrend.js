// Prevalance of games with Cosmetic
d3.csv(
  "https://raw.githubusercontent.com/kc2029/F21DV_CW2/main/resource/data/gTrend.csv"
).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 70, right: 90, bottom: 70, left: 90 },
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  //select the html
  const svg = d3
    .select("#gameTrendSVG")
    .append("svg")
    .attr("id", "gameTrend")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //parse first column into time object
  const parseDate = d3.timeParse("%d/%m/%Y");

  // Format the data
  const allGroup = ["LootBox", "Pay to Win", "Cosmetic"];

  //group data by name(allGroup)
  const dataReady = allGroup.map(function (grpName) {
    return {
      name: grpName,
      values: data.map(function (d) {
        // console.log(parseDate(d.year));
        return { time: parseDate(d.year), value: parseFloat(d[grpName]) };
      }),
    };
  });

  // A color scale: one color for each group
  const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

  // X axis scale with date object years
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.year)))
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

  // Add Y axis scale to 0 to 100%
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // draw the lines
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
    .style("stroke-width", 2)
    .style("fill", "none");

  /**
   * Calculate and draw line of best fit with linear regression
   * @date 26/03/2023 - 18:23:51
   */
  function lineBestFit() {
    //set up the regression
    const regression = d3
      .regressionLinear()
      .x((d) => x(d.time.getTime())) //date value
      .y((d) => y(d.value)); //number

    //draw the regression
    svg
      .selectAll(".regression")
      .data(dataReady)
      .join("path")
      .attr("class", "bestFits")
      .attr("d", (d) => {
        const path = regression(d.values);
        console.log(path); // check the path value
        return d3.line()(path);
      })
      .attr("stroke", (d) => myColor(d.name))
      .style("stroke-width", 3);
  }

  let lineVisible = false;

  //add line of best fit button
  const button = svg
    .append("g") // create a new <g> element to contain the button and text
    .attr("id", "bestFitButton")
    .style("cursor", "pointer")
    .on("click", function () {
      if (!lineVisible) {
        lineBestFit();
        lineVisible = true;
      } else {
        svg.selectAll(".bestFits").remove();
        lineVisible = false;
      }
    });

  button
    .append("rect")
    .attr("x", width - 575)
    .attr("y", -10)
    .attr("width", 100)
    .attr("height", 30)
    .attr("rx", 5)
    .style("fill", "grey");

  button
    .append("text")
    .text("Line of Best Fit")
    .attr("x", width - 570) // adjust the x position of the text
    .attr("y", 8) // adjust the y position of the text
    .style("fill", "white")
    .style("font-size", "14px");

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
      // on click change visibility on line depending on which name is clicked
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

  svg.select("#OnlineGames").attr("y", -10); //move label lower to avoid stacking

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("font-size", "20")
    .text("percentage(%)");

  svg
    .append("text")
    .attr("x", width - 280)
    .attr("y", margin.top / 2 - 80)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("font-weight", "bold")
    .text("Prevalance of games with Cosmetic, pay to win or lootbox");
});
