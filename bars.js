function init() {
    var dataset = [
        {name: 'AFR', score: 30}, {name: 'AMR', score: 31},
        {name: 'SEAR', score: 8}, {name: 'EUR', score: 46},
        {name: 'EMR', score: 15}, {name: 'WPR', score: 22}
    ];
    var w = 500;
    var h = 500;
    var padding = 20;
    var leftPadding = 50;

    // Create SVG element
    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Scales
    var xScale = d3.scaleBand()
        .domain(dataset.map(d => d.name)) // Use the name property for the domain
        .range([leftPadding, w - padding])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.score)]) // Use the score property to find max
        .range([h - padding, padding]);

    // Axes
    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale)
        .ticks(5); // Specify number of ticks

    // Draw bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("fill", "dark-blue")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.score))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - padding - yScale(d.score))
        ;

    // Append x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis)
        .attr("font-size", "15px")
        ;

    // Append y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${leftPadding},0)`)
        .call(yAxis)
        .attr("font-size", "15px")
        ;

/*// Label for x-axis
    svg.append("text")
    .attr("text-anchor", "end")  // Right-align text for better control at edges
    .attr("transform", `translate(${w - 160},${h - padding/200})`)  // Move to right edge, adjust y position
    .text("Number of Countries");

// Label for y-axis
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", `translate(${leftPadding - 10},${h + 20})rotate(-90)`)  // Shift left and down
    .text("WHO Region");*/
}

window.onload = init;
