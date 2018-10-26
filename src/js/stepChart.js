function resize(){

}
function init(){
  d3.csv("assets/data/runArray_2.csv", function(data){

    var gameNest = d3.nest()
      .key(function(d){
        return d.name
      })
      .key(function(d){
        return d.category_name;
      })
      .entries(data);

    var container = d3.select(".step-container");

    // console.log(gameNest);

    var width = 300;
    var height = 300;
    var parseTime = d3.timeParse("%Y-%m-%d");
    // var xScale = d3.scaleLinear().domain()


    var recordChart = container.selectAll("div")
      .data(gameNest)
      .enter()
      .append("div")
      .attr("class","game")
      .selectAll("div")
      .data(function(d){
        return d.values;
      })
      .enter()
      .append("div")
      .attr("class","game-category")
      ;

    var svg = recordChart.append("svg")
      .attr("height",height)
      .attr("width",width)
      .style("height",height+"px")
      .style("width",height+"px")
      ;

    svg.append("g").selectAll("circle")
      .data(function(d){
        var extentDates = d3.extent(d.values,function(d){
          return parseTime(d["date"]);
        })

        var extentTime = d3.extent(d.values,function(d){
          return +d["time"];
        })

        console.log(extentTime);

        d.scaleX = d3.scaleLinear().domain(extentDates).range([0,width]);
        d.scaleY = d3.scaleLinear().domain([+extentTime[1],+extentTime[0]]).range([0,height]);

        return d.values;
      })
      .enter()
      .append("circle")
      .attr("r",5)
      .attr("fill","black")
      .attr("cx",function(d,i){
        var parent = d3.select(this.parentNode).datum()
        return parent.scaleX(parseTime(d["date"]))
      })
      .attr("cy",function(d,i){
        var parent = d3.select(this.parentNode).datum()

        return parent.scaleY(+d["time"])
      })
      .classed("world-record",function(d,i){
        if(d["world_record"] == "true"){
          return true;
        }
        return false;
      })
      .on("mouseover",function(d){
        console.log(d["date"],d["time"]);
        console.log(d);
      })


  });
}

export default { init, resize };
