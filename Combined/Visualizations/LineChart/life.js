d3.csv("HEALTH_STAT.csv").then(data => {
    console.log(data);
    const svg = d3.select("svg");
    const margin = { top: 50, right: 150, bottom: 100, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const tooltip = d3.select("#tooltip");

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    function update(selectedVar) {
        console.log(`Selected variable: ${selectedVar}`);
        const filteredData = data.filter(d => d.Variable === selectedVar);
        console.log(filteredData);
        x.domain(d3.extent(filteredData, d => d.Year));
        y.domain([d3.min(filteredData, d => d.Value) - 4, d3.max(filteredData, d => d.Value)]);

        g.select(".x-axis").call(d3.axisBottom(x));
        g.select(".y-axis").call(d3.axisLeft(y));

        g.selectAll(".grid").remove();
        g.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(-height).tickFormat(""));

        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

        const dataByCountry = d3.group(filteredData, d => d.COU);

        const legendSvg = d3.select("#legend-svg");
        const legendG = legendSvg.append("g").attr("transform", "translate(10, 10)");

        const legendItemHeight = 20;
        const legendMargin = 10;
        const legend = legendG.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * (legendItemHeight + legendMargin)})`);

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .on("click", function(event, d) {
                const isActive = d3.select(this).style("opacity") === "1";
                d3.select(this).style("opacity", isActive ? 0.5 : 1);
                d3.selectAll(".country-line").filter(line => line[0] === d)
                    .style("stroke-opacity", isActive ? 0.1 : 1);
            });

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d);

        g.selectAll(".country-line").remove();
        g.selectAll(".country-line")
            .data(dataByCountry)
            .enter().append("path")
            .attr("class", "country-line")
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d[1]));

        g.selectAll(".country-line")
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1);
                tooltip.html(`Country: ${d[0]}<br>Life Expectancy: ${d[1][0].Value}`);
                d3.select(this).style("stroke-width", 4);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
                d3.select(this).style("stroke-width", 2.5);
            });
    }

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("font-size", "16px")
        .text("Life Expectancy (Years)");

    g.append("text")
        .attr("transform", `translate(${width / 2},${height + 50})`)
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Year");

    d3.select("#variable-select").on("change", function() {
        update(this.value);
    });

    update(document.getElementById("variable-select").value);
});
