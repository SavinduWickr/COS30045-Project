// world_heatmap.js
const width = 960;
const height = 600;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([50, 85]);  // Adjust this domain based on your data

// Load GeoJSON data
d3.json("https://d3js.org/world-110m.v1.json").then(worldData => {
    // Load CSV data
    d3.csv("Data_Files/HEALTH_STAT.csv").then(data => {
        const countries = topojson.feature(worldData, worldData.objects.countries).features;

        // Prepare data mapping using the 3-letter ISO country codes
        const dataMap = d3.rollup(data, v => d3.mean(v, d => +d.Value), d => d.COU, d => d.Variable);

        // Function to update the map based on the selected variable
        function update(selectedVar) {
            const countryData = new Map();
            countries.forEach(country => {
                const countryCode = country.properties.iso_a3;  // Use the 3-letter ISO country codes
                const countryValue = dataMap.get(countryCode)?.get(selectedVar);
                if (countryValue) {
                    countryData.set(countryCode, countryValue);
                }
            });

            // Update the map with new data
            svg.selectAll("path")
                .data(countries)
                .join("path")
                .attr("d", path)
                .attr("fill", d => {
                    const value = countryData.get(d.properties.iso_a3);
                    return value ? color(value) : "#ccc";  // Gray for missing data
                })
                .on("click", function(event, d) {
                    const value = countryData.get(d.properties.iso_a3);
                    tooltip.style("opacity", 1);
                    tooltip.html(`Country: ${d.properties.name}<br>Life Expectancy: ${value ? value.toFixed(2) : "N/A"}`);
                    // Add code to filter and update the detailed view using life.js
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("opacity", 0);
                });
        }

        // Update map when dropdown value changes
        d3.select("#variable-select").on("change", function() {
            update(this.value);
        });

        // Initial update to setup the map with the first selected value
        update(document.getElementById("variable-select").value);
    }).catch(error => {
        console.error('Error loading CSV data:', error);
    });
}).catch(error => {
    console.error('Error loading GeoJSON data:', error);
});
