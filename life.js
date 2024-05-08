d3.csv("Data_Files/HEALTH_STAT.csv").then(data => {
    const svg = d3.select("svg");
    const margin = { top: 50, right: 150, bottom: 200, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);  // Color scale
    const tooltip = d3.select("#tooltip");
    const t = d3.transition().duration(1000);

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    // Function to update the graph
    function update(selectedVar) {
        const filteredData = data.filter(d => d.Variable === selectedVar);
        // Update domains based on the selected variable
        x.domain(d3.extent(filteredData, d => d.Year));
        y.domain([d3.min(filteredData, d => d.Value)-4, d3.max(filteredData, d => d.Value)]);

        // Update the axes
        g.select(".x-axis").call(d3.axisBottom(x));
        g.select(".y-axis").call(d3.axisLeft(y));
        // Add horizontal gridlines
        g.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickSize(-height)
                .tickFormat("")
            )

        // Add vertical gridlines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
            )
        // Group data by country
        const dataByCountry = d3.group(filteredData, d => d.COU);


        // Create a legend for each country
        const legend = g.selectAll(".legend")
            .data(color.domain())  // Use the domain of the color scale
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(90,${i * 20})`);  // Position the legends

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .on("click", function(event, d) {  // Add click event listener
                // Mute or highlight the corresponding line
                const isActive = d3.select(this).style("opacity") === "1";
                d3.select(this).style("opacity", isActive ? 0.5 : 1);
                d3.selectAll(".country-line").filter(line => line[0] === d)
                    .style("stroke-opacity", isActive ? 0.1 : 1);
            });

        //Legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);  // Use the country code for the legend text

        //Making Country Lines
        g.selectAll(".country-line").remove();  // Clear old lines
        g.selectAll(".country-line")
            .data(dataByCountry)
            .enter().append("path")
            .attr("class", "country-line")
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))  // Use country code for color
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d[1]));  // Second element is the actual data array for that country

        //Hover Over text
        g.selectAll(".country-line")
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1);
                tooltip.html(`Country: ${d[0]}<br>Life Expectancy: ${d[1][0].Value}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
    }

    // Axes need to be added initially
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x));

    //Y axis label
    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90), translate(-200, -28)")
        .attr("font-size", "18px")
        .text("Life Expectancy (Years)");

    //X axis label
    g.append("text")
        .attr("transform", `translate(${width / 2},${height + 40})`)
        .style("text-anchor", "middle")
        .text("Year")
        .attr("font-size", "18px")

    // Update graph on dropdown change
    d3.select("#variable-select").on("change", function() {
        update(this.value);
    });

    // Initial update to setup the graph with the first selected value
    update(document.getElementById("variable-select").value);
});
