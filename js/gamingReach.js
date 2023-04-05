import { getCurrentPosition } from "./script.js";

//Load gamingReachAge.csv
d3.csv(
  "https://raw.githubusercontent.com/kc2029/F21DV_CW2/main/resource/data/gamingReachAge.csv"
).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 70, right: 30, bottom: 50, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  const svg = d3
    .select("#gameReach") // update the selector to match the ID
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //first row value except the first one
  const subgroups = data.columns.slice(1);

  //first column data except the first one
  const groups = data.map((d) => d.group);

  // Add X axis that scale with group value
  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Another scale for subgroup position
  const xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // Add Y axis and scale to max value of 100%
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // color palette, 8 colour.
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range([
      "blue",
      "#FF33C6",
      "#66FF00",
      "#39e600",
      "#ffd966",
      "#ffb366",
      "#ff8c66",
      "#ff6666",
    ]);

  /**
   * On Mouse over, make all the other bar opaque and draw a line
   * @date 26/03/2023 - 12:52:47
   */
  function mouseover(event) {
    // Get the id of the hovered element
    const hoveredClass = d3.select(this).attr("id");
    // Hide all bars except those with the hovered class
    svg
      .selectAll(".groupbar:not(#" + hoveredClass + ")") //select everything else
      .transition()
      .duration(500)
      .style("opacity", 0);
  }

  /**
   * On mouse leave, set everything visible
   */
  function mouseleave() {
    // Show all bars
    svg
      .selectAll(".groupbar")
      .interrupt()
      .transition()
      .duration(500)
      .style("opacity", 1);
  }

  // Create the group bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.group)}, 0)`)
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .join("rect")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .attr("x", (d) => xSubgroup(d.key))
    .attr("y", height)
    .attr("width", xSubgroup.bandwidth())
    .attr("fill", (d) => color(d.key))
    .attr("id", (d) => `group${d.key}`)
    .attr("class", "groupbar");

  //update the page number at set interval, and start the transition at page 1
  let intervalId = setInterval(() => {
    const position = getCurrentPosition();
    if (position === 1) {
      clearInterval(intervalId); // Stop the interval
      // Transition the bars
      svg
        .selectAll("rect")
        .transition()
        .duration(100)
        .delay((d, i) => i * 50)
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => height - y(d.value));

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width / 8},${height + 20})`);

      legend
        .selectAll("rect")
        .data(color.domain())
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 80)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color);

      legend
        .selectAll("text")
        .data(color.domain())
        .enter()
        .append("text")
        .attr("id", (d) => "legend" + d.replace(/\W/g, ""))
        .text((d) => d)
        .attr("x", (d, i) => i * 80 + 15)
        .attr("y", 10)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .on("mouseover", function (event, d) {
          let name = "group" + d;

          svg
            .selectAll(".groupbar:not(#" + name + ")")
            .transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("mouseleave", function (event, d) {
          svg
            .selectAll(".groupbar")
            .transition()
            .duration(500)
            .style("opacity", 1);
        });
    }
  }, 1000);

  //Title Label
  svg
    .append("text")
    .attr("x", width - 450)
    .attr("y", margin.top / 2 - 60)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("font-weight", "bold")
    .text("Percentage of people who play games by age and gender group");

  // Y axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("font-size", "20")
    .text("Percentage(%)");
});
