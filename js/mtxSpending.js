d3.csv(
  "https://raw.githubusercontent.com/kc2029/F21DV_CW2/main/resource/data/mtxSpend.csv"
).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 70, right: 80, bottom: 30, left: 100 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#mtxSpend")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear().domain([0, 110]).range([0, width]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Y axis
  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      data.map(function (d) {
        return d.game;
      })
    )
    .padding(1);
  svg.append("g").call(d3.axisLeft(y));

  // Lines
  svg
    .selectAll("myline")
    .data(data)
    .join("line")
    .attr("x1", function (d) {
      return x(d.women);
    })
    .attr("x2", function (d) {
      return x(d.men);
    })
    .attr("y1", function (d) {
      return y(d.game);
    })
    .attr("y2", function (d) {
      return y(d.game);
    })
    .attr("stroke", "black")
    .attr("stroke-width", "5px");
  console.log(data);

  // Circles of variable 1
  svg
    .selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) {
      console.log(d.women);
      return x(d.women);
    })
    .attr("cy", function (d) {
      return y(d.game);
    })
    .attr("r", "10")
    .style("fill", "pink")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", "15"); // Increase size of circle on mouseover

      // Add tooltip text
      var tooltip = svg.append("g").attr("class", "tooltipDot");

      var tooltipBg = tooltip
        .append("rect")
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px");

      var tooltipText = tooltip
        .append("text")
        .text("$" + d.women)
        .style("text-anchor", "middle")
        .attr("dy", "0.35em");

      var bbox = tooltipText.node().getBBox();

      tooltipBg
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 16)
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 8);

      tooltip
        .attr(
          "transform",
          "translate(" +
            (x(d.women) + 15) +
            "," +
            (y(d.game) - bbox.height - 25) +
            ")"
        )
        .raise(); // Move to top of SVG stacking order
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("r", "10"); // Reset size of circle on mouseout
      svg.select(".tooltipDot").remove(); // Remove tooltip text
    });

  // Circles of variable 2
  svg
    .selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) {
      return x(d.men);
    })
    .attr("cy", function (d) {
      return y(d.game);
    })
    .attr("r", "10")
    .style("fill", "Blue")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", "15"); // Increase size of circle on mouseover

      // Add tooltip text
      var tooltip = svg.append("g").attr("class", "tooltipDot");

      var tooltipBg = tooltip
        .append("rect")
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px");

      var tooltipText = tooltip
        .append("text")
        .text("$" + d.men)
        .style("text-anchor", "middle")
        .attr("dy", "0.35em");

      var bbox = tooltipText.node().getBBox();

      tooltipBg
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 16)
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 8);

      tooltip
        .attr(
          "transform",
          "translate(" +
            (x(d.men) + 15) +
            "," +
            (y(d.game) - bbox.height - 25) +
            ")"
        )
        .raise(); // Move to top of SVG stacking order
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("r", "10"); // Reset size of circle on mouseout
      svg.select(".tooltipDot").remove(); // Remove tooltip text
    });

  // Append title
  svg
    .append("text")
    .attr("x", (width + margin.left + margin.right) / 2 - 100)
    .attr("y", margin.top - 105)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("font-weight", "bold")

    .text("Male and Female gamer spending habit in game");
});
