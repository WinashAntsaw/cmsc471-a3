const UNFILTERED_PATH = "./data/greenhouse_unfiltered.csv"
/*
ACTION
BASE_PER
Base period
CONVERSION_TYPE
Conversion type
DECIMALS
Decimals
FREQ
Frequency of observation
MEASURE
Measure
OBS_STATUS
OBS_VALUE
Observation status
Observation value
POLLUTANT
PRICE_BASE
Pollutant
Price base
REF_AREA
Reference area
STRUCTURE
STRUCTURE_ID
STRUCTURE_NAME
TIME_PERIOD
Time period
UNIT_MEASURE
UNIT_MULT
Unit multiplier
Unit of measure
*/

function init() {
    d3.csv(UNFILTERED_PATH).then(data => {
        cleanUpData(data);
        createWhiteHat(data);
    })
    .catch(error => console.error('Error loading data:', error));
}

function cleanUpData(data){
    data.forEach(function(d) {
        delete d.STRUCTURE_NAME;
        delete d.STRUCTURE_ID;
        delete d.STRUCTURE;
        d.OBS_VALUE = +d.OBS_VALUE;
        d.TIME_PERIOD = +d.TIME_PERIOD;
    });

    let temp = data.filter(x => x.REF_AREA == "USA" && x.TIME_PERIOD == 1990);
    //temp = temp.filter(x => x.UNIT_MEASURE == "KG_CO2E_PS"); //&& x.MEASURE == "_T");
    let measures = [];
    temp.forEach(x => measures.push(x.UNIT_MEASURE));


    console.log("TEMP");
    console.log(measures);
}


function createWhiteHat(data) {
    const margin = {top: 40, right: 40, bottom: 40, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    data = data.filter(d => d.UNIT_MEASURE == "KG_CO2E_PS" && d.MEASURE == "T_LULU");
    console.log(data);
    let ref_areas = ["USA", "GBR", "FRA"];
    let countryNames = ["United States", "United Kingdom", "France"]

    data = data.filter(d => ref_areas.indexOf(d.REF_AREA) != -1);           // only include the countries we are looking at

    let min_year = d3.min(data, d => d.TIME_PERIOD);
    let max_year = d3.max(data, d => d.TIME_PERIOD);

    // Create SVG
    const svg = d3.select('#wVis')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);


    const xScale = d3.scaleLinear() // a numeric / quantative scale
        .domain([d3.min(data, d => d.TIME_PERIOD), d3.max(data, d => d.TIME_PERIOD)]) // prefined data range
        .range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d=> d.OBS_VALUE), d3.max(data, d => d.OBS_VALUE)]) // prefined data range
        .range([height, 0]);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, 0)`)
        .call(yAxis);

    colors = ["red", "green", "blue"];

    
    // Entering in the Data
    svg.selectAll('.point')
        .data(data)
        .join(
                function(enter){
                    return enter
                        .append('circle')
                        .attr('cx', d => xScale(d.TIME_PERIOD))
                        .attr('cy', d => yScale(d.OBS_VALUE))
                        .style('fill', d => d.color)
                        .attr('class', 'point')
                        .style('fill', d => colors[ref_areas.indexOf(d.REF_AREA)])
                        .transition()
                        .attr('r', 4);
                },
                function(update){
                    return  update
                        .transition()
                        .attr('cx', d => xScale(d.TIME_PERIOD))
                        .attr('cy', d => yScale(d.OBS_VALUE))
                }, 
                function(exit){
                    return  exit.transition().attr('r', 0).remove()
                }
        );

        // Add the Legend for the country colors
        function addLegend(){
            // Adds a legend so users can decode colors
            let size = 10
        
            svg.selectAll('countrySquare')
                .data(colors)
                .enter()
                .append('rect')
                .attr('y', -margin.top/2)
                .attr('x', (d, i) => i * (size + 120) + 100)
                .attr('width', size)
                .attr('height', size)
                .style("fill", (d, i) => colors[i])
            
            svg.selectAll("countryNames")
                .data(countryNames)
                .enter()
                .append("text")
                .attr("y", -margin.top/2 + size) // Align vertically with the square
                .attr("x", (d, i) => i * (size + 120) + 120)  
                .style("fill", (d, i) => colors[i])  // Match text color to the square
                .text(d => d) // The actual continent name
                .attr("text-anchor", "left")
                .style('font-size', '13px')
        }
        addLegend();

        // Add the titles for the axes
        function addAxisTitles() {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .attr("text-anchor", "middle")
                .text("Year") // Displays the current x-axis variable
                .attr('class', 'labels')

            // Y-axis label (rotated)
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 40)
                .attr("text-anchor", "middle")
                .text("Kilogrammes of CO2-equivalent Per Person") // Displays the current y-axis variable
                .attr('class', 'labels')
        }
        addAxisTitles();

        // Add the title for the chart
        function addTitle() {
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -25)
                .attr('text-anchor', 'middle')
                .text('Pollution Per Capita for USA, UK, and France (1990-2022)')
                .attr('class', 'labels')
        }
        addTitle();
    }
    

    


window.addEventListener('load', init);