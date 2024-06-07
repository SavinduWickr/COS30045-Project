const chartData = {
    2017: {
        AFR: [55, 17, 10, 19],
        AMR: [37, 7, 30, 27],
        EMR: [47, 18, 12, 24],
        EUR: [23, 8, 25, 45],
        SEAR: [67, 11, 22, 0],
        WPR: [33, 10, 24, 33]
    },
    2020: {
        AFR: [50, 24, 13, 13],
        AMR: [26, 19, 16, 39],
        EMR: [20, 27, 20, 33],
        EUR: [17, 0, 26, 57],
        SEAR: [62, 0, 13, 25],
        WPR: [27, 9, 18, 46]
    }
};

const colors = {
    AFR: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    AMR: ['#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
    EMR: ['#FF6384', '#C9CBCF', '#FFCE56', '#36A2EB'],
    EUR: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    SEAR: ['#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
    WPR: ['#FF6384', '#C9CBCF', '#FFCE56', '#36A2EB']
};

const descriptions = {
    AFR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities'],
    AMR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities'],
    EMR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities'],
    EUR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities'],
    SEAR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities'],
    WPR: ['Does not exist', 'Exist but not functioning well', 'Provides irregular/partial inspection on mental health facilities', 'Provides regular inspection on mental health facilities']
};

//const legendText = {'Does not exist': 'Exist but not functioning well': 'Provides irregular/partial inspection on mental health facilities': 'Provides regular inspection on mental health facilities'};

function displayChart() {
    const selectedYear = document.getElementById('yearSelector').value;
    const selectedChart = document.getElementById('chartSelector').value;
    const data = chartData[selectedYear][selectedChart];
    const color = colors[selectedChart];
    const description = descriptions[selectedChart];

    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    d3.select("#chart").select("svg").remove();

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d)
        .sort(null);

    const data_ready = pie(data);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color[i])
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on('mouseover', function(event, d) {
            tooltip.style('display', 'inline-block');
            tooltip.html(`${description[d.index]}: ${((d.data / d3.sum(data)) * 100).toFixed(2)}%`);
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
        });

        const legend = svg.append('g')
        .attr('transform', `translate(${radius + 20}, ${-radius})`)
        .attr('class', 'legend');

    description.forEach((desc, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);

        legendRow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', color[i]);

        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .attr('text-anchor', 'start')
            .style('font-size', '14px')
            .style('text-transform', 'capitalize')
            .text(descriptions);
    });

    const tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("display", "none")
        ;
}
