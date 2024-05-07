function init() {
    const width = 450, height = 450, margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    // Correct variable names for SVG dimensions
    var svg = d3.select("#donut")
                .append("svg")
                .attr("width", width) // Use width instead of w
                .attr("height", height) // Use height instead of h
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

    var data = [50, 24, 13, 13];

    // Setting up the colors
    const maxDataValue = Math.max(...data); // Get the maximum value for reference
    const color = d3.scaleLinear()
                    .domain([0, maxDataValue])
                    .range(["#ffeda0", "#f03b20"]) // Light orange to dark orange
                    .interpolate(d3.interpolateHcl); // Use HCL interpolation for color changes

    // Pie chart setup
    const pie = d3.pie()
                  .value(d => d); // Correct the value accessor

    const data_ready = pie(data); // Directly use data array

    // Drawing arcs
    svg.selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
                .innerRadius(100)
                .outerRadius(radius))
        .attr('fill', d => color(d.data)) // d.data is the value from the original data array
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
}

window.onload = init;
