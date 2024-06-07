function init() {
    const data = [
        { group: "Africa", '2017': 42, '2020': 40, description: "Africa" },
        { group: "Americas", '2017': 30, '2020': 37, description: "America" },
        { group: "East Mediterranean", '2017': 17, '2020': 15, description: "East Mediterranean" },
        { group: "Europe", '2017': 42, '2020': 43, description: "Europe" },
        { group: "South East Asia", '2017': 11, '2020': 11, description: "South East Asian Region" },
        { group: "Western Pacific", '2017': 21, '2020': 21, description: "Western Pacific Region" }
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("display", "block")
        .style("margin", "auto")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(['2017', '2020'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d['2017'], d['2020']))]).nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['2017', '2020'])
        .range(["#1f77b4", "#ff7f0e"]);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("font-size", "20px")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("position", "absolute");

    function updateChart(years) {
        svg.selectAll("*").remove();

        const groups = svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.group)},0)`);

        years.forEach(year => {
            groups.selectAll(`.bar${year}`)
                .data(d => [{ key: year, value: d[year], group: d.group, description: d.description }])
                .join("rect")
                .attr("class", `bar${year}`)
                .attr("x", d => x1(d.key))
                .attr("y", d => y(d.value))
                .attr("width", x1.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", color(year))
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`Region: ${d.description}<br>Number of Responding Countries: ${d.value}`)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });
        });

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .text("WHO Regions");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .text("Number of Responding Countries");

        // Legend part
        const legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(['2017', '2020'])
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(d => d);
    }

    updateChart(['2017', '2020']);

    window.updateChart = updateChart;  // Expose the function globally for button events
}

window.onload = init;



