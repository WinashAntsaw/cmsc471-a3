const UNFILTERED_PATH = "../data/greenhouse_unfiltered.csv"


function init() {
    d3.csv(UNFILTERED_PATH).then(data => {
        console.log(data);
        createWhiteHat(data);
        createBlackHat(data);
    })
    .catch(error => console.error('Error loading data:', error));
}



function createWhiteHat(data) {

}

function createBlackHat(data) {

}

window.addEventListener('load', init)