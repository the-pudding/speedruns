/* global d3 */
import './pudding-chart/plateau-template'

// data
let data = null
let chart = null

function resize() {}

function loadData(){
  return new Promise((resolve, reject) => {
    d3.loadData('assets/data/allRuns_wAdds.csv', (err, response) => {
      if (err) reject(err)
      else resolve(response)
      data = response
    })
  })
}
function setupChart() {
	chart = d3.select('#plateau-chart').datum(data).plateauChart();
}

function init() {
  return new Promise((resolve) => {
    loadData()
      .then(response => {
        setupChart(response[0]);
      })
  })
}

export default { init, resize };
