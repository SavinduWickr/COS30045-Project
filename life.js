d3.csv("Data_Files/HEALTH_STAT.csv").then(data => {
    const svg = d3.select("svg");
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);  // Color scale

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    // Parse numeric values and setup domains
    data.forEach(d => {
        d.Year = +d.Year;
        d.Value = +d.Value;
    });

    x.domain(d3.extent(data, d => d.Year));
    y.domain([0, d3.max(data, d => d.Value)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Life Expectancy (Years)");

    // Function to update the graph
// Function to update the graph
    function update(selectedVar) {
        const filteredData = data.filter(d => d.Variable === selectedVar);

        // Group data by country
        const dataByCountry = d3.group(filteredData, d => d.COU);

        g.selectAll(".country-line").remove();  // Clear old lines
        g.selectAll(".country-line")
            .data(dataByCountry)
            .enter().append("path")
            .attr("class", "country-line")
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))  // Use country code for color
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", d => line(d[1]));  // Second element is the actual data array for that country
    }

    // Update graph on dropdown change
    d3.select("#variable-select").on("change", function() {
        update(this.value);
    });

    // Initial update
    update(document.getElementById("variable-select").value);
});
