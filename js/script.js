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
        console.log(data[0]);
        createWhiteHat(data);
        createBlackHat(data);
    })
    .catch(error => console.error('Error loading data:', error));
}

function cleanUpData(data){
    data = data.forEach(function(d) {
        delete d.STRUCTURE_NAME;
        delete d.STRUCTURE_ID;
        delete d.STRUCTURE;
    })
}


function createWhiteHat(data) {

}

function createBlackHat(data) {

}

window.addEventListener('load', init)