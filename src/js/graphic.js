/* global d3 */
import './pudding-chart/plateau-template'

// data
let data = null

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

function init() {
  return new Promise((resolve) => {
    loadData()
      .then(response => {
        //console.log(data)
      })
  })
}

export default { init, resize };
