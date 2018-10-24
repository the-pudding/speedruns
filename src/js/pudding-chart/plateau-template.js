/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.plateauChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 32;
		const marginBottom = 32*6;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		let xScale = d3.scaleTime();
		let xAxis = null;
		let xAxisGroup = null;
		let yScale = d3.scaleLinear();
		let yAxis = null;
		let yAxisGroup = null;
		let axisPadding = null;
		let circleGroup = null;
		let $circles = null;
		let maxX = null;
		let minX = null;
		let maxY = null;

		// dealing with dates & times
		let parseDate = d3.timeParse('%Y-%m-%d')

		//data
		let cleanedData = null;

		// helper functions
		function updateScales() {
			xScale = d3
				.scaleLinear()
				.domain([minX, maxX])
				.range([0, width])

			yScale = d3
				.scaleLinear()
				.domain([0, 2000])
				.range([height, 0]);

			xAxis = d3
				.axisBottom(xScale)
				.tickPadding(8)
				.ticks(10)
				.tickFormat(d3.timeFormat('%Y'))

			yAxis = d3
				.axisLeft(yScale)
				.tickPadding(8)
				.tickSize(-width)
				.ticks(8)
				.tickFormat(d => convertSeconds(d))
		}

		function convertSeconds(time) {
			const minutes = Math.floor(time/60)
			const seconds = time - minutes * 60

			function timeFormat(string,pad,length) {
		    return (new Array(length+1).join(pad)+string).slice(-length);
			}

			const finalTime = timeFormat(minutes,'0',2)+':'+timeFormat(seconds,'0',2);
			return finalTime
		}

		function cleanData() {
			cleanedData = data[0]
			cleanedData.forEach(function(d) {
				d.date = parseDate(d.date);
				d.timeClock = convertSeconds(d.time)
			})

			cleanedData = cleanedData.filter(function(d) {
				return d.category_name === "Any%" &&
				d.emulated !== "true" &&
				d.status === "verified"
			})

			maxX = d3.max(cleanedData, function(d) { return d.date})
			minX = d3.min(cleanedData, function(d) { return d.date})
			maxY = d3.max(cleanedData, function(d) { return d.time})

			cleanedData = d3.nest()
				.key(function(d) { return d.name;})
				.entries(cleanedData);

			console.log(cleanedData)
		}

		const Chart = {
			// called once at start
			init() {
				cleanData()
				$svg = $sel.append('svg.pudding-chart');
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $svg.append('g.g-axis');

				xAxisGroup = $axis.append('g')
					.attr('class', 'x axis')

				yAxisGroup = $axis.append('g')
					.attr('class', 'y axis')
					.selectAll('g')
					.classed('g-baseline', function(d) {return d == 0})

				// setup viz group
				$vis = $g.append('g.g-vis');

				circleGroup = $vis.selectAll('.g-vis')
					.data(cleanedData)
					.enter()
					.append('g')

				$circles = circleGroup.selectAll('circle')
					.data( function(d) { return d.values; })
					.enter()
					.append('circle')
					.attr('class', function(d) { return 'run-circle circle-' + d.game})
					.attr('r', 2)

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				axisPadding = height + marginTop

				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

				updateScales()

				$vis.selectAll('.run-circle')
					.attr('cx', function(d){return xScale(d.date);})
					.attr('cy', function(d){return yScale(d.time);})

				$axis.select('.x')
					.at('transform', `translate(${marginLeft},${axisPadding})`)
					.call(xAxis);

				$axis.select('.y')
					.at('transform', `translate(${marginLeft}, ${marginTop})`)
					.call(yAxis);

				d3.selectAll(".y.axis text")
		      	.attr("transform", "translate(34, -10)");

				return Chart;
			},
			// update scales and render chart
			render() {
				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
