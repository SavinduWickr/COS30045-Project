
function init() {
    var dataset = [
        { name: 'AFR', score: 30 }, { name: 'AMR', score: 31 },
        { name: 'SEAR', score: 8 }, { name: 'EUR', score: 46 },
        { name: 'EMR', score: 15 }, { name: 'WPR', score: 22 }
    ];

    var w = 600;
    var h = 400;
    var padding = 50;
    var leftPadding = 80;

    // Create SVG element
    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Scales
    var xScale = d3.scaleBand()
        .domain(dataset.map(d => d.name))
        .range([leftPadding, w - padding])
        .paddingInner(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.score)])
        .range([h - padding, padding]);

    // Axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    // Draw bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.score))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - padding - yScale(d.score))
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "orange");
            // Position and display tooltip
            d3.select("#tooltip")
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 100) + "px")
                .style("display", "inline-block");
            createDonutChart(d);
        })
        .on("mouseout", function (d) {
            d3.select(this).attr("fill", "steelblue");
            // Hide tooltip
            d3.select("#tooltip").style("display", "none");
        });

    // Append x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis)
        .attr("font-size", "15px");

    // Append y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${leftPadding},0)`)
        .call(yAxis)
        .attr("font-size", "15px");

    // Add x-axis label
    svg.append("text")
        .attr("x", (w / 2))
        .attr("y", h - padding / 6)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("WHO Regions");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", leftPadding / 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Scores");

    // Tooltip setup
    d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("pointer-events", "none")
        .append("svg")
        .attr("width", 450)
        .attr("height", 450);
}

// Function to create a donut chart
function createDonutChart(d) {
    const width = 450, height = 450, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    var svg = d3.select("#tooltip svg").selectAll("*").remove(); // Clear existing content

    var data = [50, 24, 13, 13];

    // Setting up the colors
    const maxDataValue = Math.max(...data);
    const color = d3.scaleLinear()
        .domain([0, maxDataValue])
        .range(["#ffeda0", "#f03b20"])
        .interpolate(d3.interpolateHcl);

    // Pie chart setup
    const pie = d3.pie().value(d => d);
    const data_ready = pie(data);

    // Drawing arcs
    d3.select("#tooltip svg")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll('path')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc().innerRadius(100).outerRadius(radius))
        .attr('fill', d => color(d.data))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
}

window.onload = init;



