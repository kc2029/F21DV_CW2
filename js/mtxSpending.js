d3.csv(
  "https://raw.githubusercontent.com/kc2029/F21DV_CW2/main/resource/data/mtxSpend.csv"
).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 100 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#page6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear().domain([-1, 6]).range([0, width]);

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
      return x(d.Women);
    })
    .attr("x2", function (d) {
      return x(d.Men);
    })
    .attr("y1", function (d) {
      return y(d.game);
    })
    .attr("y2", function (d) {
      return y(d.game);
    })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");

  // Circles of variable 1
  svg
    .selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) {
      return x(d.Women);
    })
    .attr("cy", function (d) {
      return y(d.game);
    })
    .attr("r", "6")
    .style("fill", "#69b3a2");

  // Circles of variable 2
  svg
    .selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) {
      return x(d.Men);
    })
    .attr("cy", function (d) {
      return y(d.game);
    })
    .attr("r", "6")
    .style("fill", "#4C4082");
});
