d3.csv("./resource/data/MarketValue2.csv", d3.autoType).then(function (data) {
  // set the dimensions and margins of the graph
  const margin = { top: 80, right: 30, bottom: 20, left: 80 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page

  const svg = d3
    .select("#gameStack")
    .append("svg")
    .attr("id", "stackedB")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //List of headers
  const subgroups = data.columns.slice(1);
  console.log(subgroups);
  const groups = data.map((d) => d.year);
  console.log(data);

  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  //find the max row total
  const totals = data.map((row) => {
    let sum = 0;
    for (const key in row) {
      if (key !== "year") {
        if (typeof row[key] === "number" && !isNaN(row[key])) {
          sum += row[key];
        }
      }
    }
    return sum;
  });
  const maxTotal = Math.max(...totals.filter((total) => !isNaN(total)));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, maxTotal]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  //color scale for 13 color
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range([
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928",
      "#999999",
    ]);

  const stackedData = d3.stack().keys(subgroups)(data);

  //
  //
  //
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
    .style("max-width", "150px")
    .style("height", "35px");

  function mouseover(event, d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    tooltip
      .html(` ${subgroupName}<br>  ${subgroupValue} millions`)
      .style("opacity", 1);
  }

  const mousemove = function (event, d) {
    // Calculate the x and y positions of the tooltip
    const xPosition = event.pageX;
    const yPosition = event.pageY - 520;

    tooltip
      .style("transform", `translate(${xPosition}px, ${yPosition}px)`)
      .style("opacity", 1);
  };

  function mouseleave(event, d) {
    tooltip.style("opacity", 0);
    // Back to normal opacity: 1
    d3.selectAll(".myRect").style("opacity", 1);
  }

  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
    .attr("fill", function (d) {
      return color(d.key);
    })

    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => x(d.data.year))
    .attr("y", (d) => (isNaN(y(d[1])) ? 0 : y(d[1])))
    .attr("height", (d) =>
      isNaN(y(d[0])) || isNaN(y(d[1])) ? 0 : y(d[0]) - y(d[1])
    )

    .attr("width", x.bandwidth())
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("font-size", "20")
    .style("font-weight", "bold")

    .text("Billions($)");

  svg
    .append("text")
    .attr("x", width - 500)
    .attr("y", margin.top / 2 - 70)
    .attr("text-anchor", "middle")

    .text("UK Gaming revene split")
    .style("font-size", "25px")
    .style("font-weight", "bold");
});
