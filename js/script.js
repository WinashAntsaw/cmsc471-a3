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
        console.log(data.length);
        createWhiteHat(data);
        createBlackHat(data);
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
}


function createWhiteHat(data) {
    const margin = {top: 40, right: 40, bottom: 40, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;




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
        .domain([0, d3.max(data, d => d.OBS_VALUE)]) // prefined data range
        .range([height, 0]);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, 0)`)
        .call(yAxis);

    let averagedData = 

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
                        .transition()
                        .attr('r', 2);
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
    
}

function createBlackHat(data) {

}

window.addEventListener('load', init)