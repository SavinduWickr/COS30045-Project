const width = 960;
const height = 600;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([50, 90]);  // Adjust this domain based on your data

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        svg.selectAll('path')
            .attr('transform', event.transform);
    });

svg.call(zoom);

// Mapping from numeric country codes to 3-letter ISO codes
const countryCodeMap = {
    "004": "AFG",
    "008": "ALB",
    "010": "ATA",
    "012": "DZA",
    "016": "ASM",
    "020": "AND",
    "024": "AGO",
    "028": "ATG",
    "031": "AZE",
    "032": "ARG",
    "036": "AUS",
    "040": "AUT",
    "044": "BHS",
    "048": "BHR",
    "050": "BGD",
    "051": "ARM",
    "052": "BRB",
    "056": "BEL",
    "060": "BMU",
    "064": "BTN",
    "068": "BOL",
    "070": "BIH",
    "072": "BWA",
    "074": "BVT",
    "076": "BRA",
    "084": "BLZ",
    "086": "IOT",
    "090": "SLB",
    "092": "VGB",
    "096": "BRN",
    "100": "BGR",
    "104": "MMR",
    "108": "BDI",
    "112": "BLR",
    "116": "KHM",
    "120": "CMR",
    "124": "CAN",
    "132": "CPV",
    "136": "CYM",
    "140": "CAF",
    "144": "LKA",
    "148": "TCD",
    "152": "CHL",
    "156": "CHN",
    "158": "TWN",
    "162": "CXR",
    "166": "CCK",
    "170": "COL",
    "174": "COM",
    "175": "MYT",
    "178": "COG",
    "180": "COD",
    "184": "COK",
    "188": "CRI",
    "191": "HRV",
    "192": "CUB",
    "196": "CYP",
    "203": "CZE",
    "204": "BEN",
    "208": "DNK",
    "212": "DMA",
    "214": "DOM",
    "218": "ECU",
    "222": "SLV",
    "226": "GNQ",
    "231": "ETH",
    "232": "ERI",
    "233": "EST",
    "238": "FLK",
    "239": "SGS",
    "242": "FJI",
    "246": "FIN",
    "250": "FRA",
    "254": "GUF",
    "258": "PYF",
    "260": "ATF",
    "262": "DJI",
    "266": "GAB",
    "268": "GEO",
    "270": "GMB",
    "275": "PSE",
    "276": "DEU",
    "288": "GHA",
    "292": "GIB",
    "296": "KIR",
    "300": "GRC",
    "304": "GRL",
    "308": "GRD",
    "312": "GLP",
    "316": "GUM",
    "320": "GTM",
    "324": "GIN",
    "328": "GUY",
    "332": "HTI",
    "334": "HMD",
    "336": "VAT",
    "340": "HND",
    "344": "HKG",
    "348": "HUN",
    "352": "ISL",
    "356": "IND",
    "360": "IDN",
    "364": "IRN",
    "368": "IRQ",
    "372": "IRL",
    "376": "ISR",
    "380": "ITA",
    "384": "CIV",
    "388": "JAM",
    "392": "JPN",
    "398": "KAZ",
    "400": "JOR",
    "404": "KEN",
    "408": "PRK",
    "410": "KOR",
    "414": "KWT",
    "417": "KGZ",
    "418": "LAO",
    "422": "LBN",
    "426": "LSO",
    "428": "LVA",
    "430": "LBR",
    "434": "LBY",
    "438": "LIE",
    "440": "LTU",
    "442": "LUX",
    "446": "MAC",
    "450": "MDG",
    "454": "MWI",
    "458": "MYS",
    "462": "MDV",
    "466": "MLI",
    "470": "MLT",
    "474": "MTQ",
    "478": "MRT",
    "480": "MUS",
    "484": "MEX",
    "492": "MCO",
    "496": "MNG",
    "498": "MDA",
    "499": "MNE",
    "500": "MSR",
    "504": "MAR",
    "508": "MOZ",
    "512": "OMN",
    "516": "NAM",
    "520": "NRU",
    "524": "NPL",
    "528": "NLD",
    "531": "CUW",
    "533": "ABW",
    "534": "SXM",
    "535": "BES",
    "540": "NCL",
    "548": "VUT",
    "554": "NZL",
    "558": "NIC",
    "562": "NER",
    "566": "NGA",
    "570": "NIU",
    "574": "NFK",
    "578": "NOR",
    "580": "MNP",
    "583": "FSM",
    "584": "MHL",
    "585": "PLW",
    "586": "PAK",
    "591": "PAN",
    "598": "PNG",
    "600": "PRY",
    "604": "PER",
    "608": "PHL",
    "612": "PCN",
    "616": "POL",
    "620": "PRT",
    "624": "GNB",
    "626": "TLS",
    "630": "PRI",
    "634": "QAT",
    "638": "REU",
    "642": "ROU",
    "643": "RUS",
    "646": "RWA",
    "652": "BLM",
    "654": "SHN",
    "659": "KNA",
    "660": "AIA",
    "662": "LCA",
    "663": "MAF",
    "666": "SPM",
    "670": "VCT",
    "674": "SMR",
    "678": "STP",
    "682": "SAU",
    "686": "SEN",
    "688": "SRB",
    "690": "SYC",
    "694": "SLE",
    "702": "SGP",
    "703": "SVK",
    "704": "VNM",
    "705": "SVN",
    "706": "SOM",
    "710": "ZAF",
    "716": "ZWE",
    "724": "ESP",
    "728": "SSD",
    "729": "SDN",
    "740": "SUR",
    "748": "SWZ",
    "752": "SWE",
    "756": "CHE",
    "760": "SYR",
    "762": "TJK",
    "764": "THA",
    "768": "TGO",
    "772": "TKL",
    "776": "TON",
    "780": "TTO",
    "784": "ARE",
    "788": "TUN",
    "792": "TUR",
    "795": "TKM",
    "796": "TCA",
    "798": "TUV",
    "800": "UGA",
    "804": "UKR",
    "807": "MKD",
    "818": "EGY",
    "826": "GBR",
    "831": "GGY",
    "832": "JEY",
    "833": "IMN",
    "834": "TZA",
    "840": "USA",
    "850": "VIR",
    "854": "BFA",
    "858": "URY",
    "860": "UZB",
    "862": "VEN",
    "876": "WLF",
    "882": "WSM",
    "887": "YEM",
    "894": "ZMB",
    "-99": "UNK"
};


d3.json("https://d3js.org/world-110m.v1.json").then(worldData => {
    d3.csv("HEALTH_STAT.csv").then(data => {
        console.log("CSV Data:", data); // Debugging output

        const countries = topojson.feature(worldData, worldData.objects.countries).features;
        console.log("Countries Data:", countries); // Log countries data

        // Prepare data mapping using the 3-letter ISO country codes
        const dataMap = d3.rollup(data, v => ({
            meanValue: d3.mean(v, d => +d.Value),
            countryName: v[0].Country
        }), d => d.COU, d => `${d.Variable}-${d.YEA}`);
        console.log("Data Map:", dataMap); // Debugging output

        // Function to update the map based on the selected variable and year
        function update(selectedVar, selectedYear) {
            const yearKey = `${selectedVar}-${selectedYear}`;
            const countryData = new Map();
            let minValue = Infinity, maxValue = -Infinity;

            countries.forEach(country => {
                const countryCode = countryCodeMap[country.id];  // Use the mapped country codes
                const countryInfo = dataMap.get(countryCode)?.get(yearKey);
                console.log(`Country: ${countryCode}, Info: ${countryInfo}`); // Debugging output
                if (countryInfo) {
                    countryData.set(countryCode, countryInfo);
                    minValue = Math.min(minValue, countryInfo.meanValue);
                    maxValue = Math.max(maxValue, countryInfo.meanValue);
                }
            });
            console.log("Country Data:", countryData); // Debugging output

            // Update color scale domain based on the current data
            color.domain([minValue, maxValue]);

            // Update the legend
            updateLegend(minValue, maxValue);

            // Update the map with new data
            svg.selectAll("path")
                .data(countries)
                .join("path")
                .attr("d", path)
                .attr("fill", d => {
                    const info = countryData.get(countryCodeMap[d.id]);
                    return info ? color(info.meanValue) : "#ccc";  // Gray for missing data
                })
                .on("mouseover", function(event, d) {
                    const info = countryData.get(countryCodeMap[d.id]);
                    tooltip.style("opacity", 1);
                    tooltip.html(`Country: ${info ? info.countryName : 'N/A'}<br>Life Expectancy: ${info ? info.meanValue.toFixed(2) : "N/A"}`);
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("opacity", 0);
                })
                .on("click", function(event, d) {
                    const [[x0, y0], [x1, y1]] = path.bounds(d);
                    event.stopPropagation();
                    svg.transition().duration(750).call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
                    );
                });

            // Reset zoom on background click
            svg.on("click", () => {
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(1)
                );
            });
        }

        // Function to create the legend
        function createLegend() {
            const legendWidth = 300;
            const legendHeight = 10;

            const legendSvg = d3.select("#legend")
                .append("svg")
                .attr("width", legendWidth)
                .attr("height", legendHeight);

            const gradient = legendSvg.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color(50))
                .attr("stop-opacity", 1);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color(90))
                .attr("stop-opacity", 1);

            legendSvg.append("rect")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .style("fill", "url(#gradient)");

            const legendScale = d3.scaleLinear()
                .domain([50, 90])
                .range([0, legendWidth]);

            const legendAxis = d3.axisBottom(legendScale)
                .ticks(5)
                .tickFormat(d3.format(".0f"));

            legendSvg.append("g")
                .attr("transform", `translate(0,${legendHeight})`)
                .call(legendAxis);
        }

        // Function to update the legend
        function updateLegend(minValue, maxValue) {
            const legendWidth = 300;
            const legendHeight = 10;

            const legendSvg = d3.select("#legend svg");
            const gradient = legendSvg.select("linearGradient");

            gradient.selectAll("stop")
                .data([
                    { offset: "0%", color: color(minValue) },
                    { offset: "100%", color: color(maxValue) }
                ])
                .join("stop")
                .attr("offset", d => d.offset)
                .attr("stop-color", d => d.color)
                .attr("stop-opacity", 1);

            const legendScale = d3.scaleLinear()
                .domain([minValue, maxValue])
                .range([0, legendWidth]);

            const legendAxis = d3.axisBottom(legendScale)
                .ticks(5)
                .tickFormat(d3.format(".0f"));

            legendSvg.select("g")
                .call(legendAxis);
        }

        // Create the legend
        createLegend();

        // Initial update to setup the map with the first selected value
        const initialYear = document.getElementById("year").value;
        update(document.getElementById("variable-select").value, initialYear);

        // Update map when dropdown value changes
        d3.select("#variable-select").on("change", function() {
            update(this.value, document.getElementById("year").value);
        });

        // Update map when year slider changes
        d3.select("#year").on("input", function() {
            document.getElementById("year-value").textContent = this.value;
            update(document.getElementById("variable-select").value, this.value);
        });

        // Set initial year display
        document.getElementById("year-value").textContent = initialYear;
    }).catch(error => {
        console.error('Error loading CSV data:', error);
    });
}).catch(error => {
    console.error('Error loading GeoJSON data:', error);
});
