// Lesson 05_01

var bardata = [20, 30, 105, 15, 85, 20, 30, 105, 15, 85];

// bardata.sort(function compareNumbers(a,b){
//   return a-b;
// });

var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5;
var tempColor;
var yScale = d3.scale.linear()
    .domain([0, d3.max(bardata)])
    .range([0, height])

var xScale = d3.scale.ordinal()
    .domain(d3.range(0, bardata.length))
    .rangeBands([0, width])

var colors = d3.scale.linear()
    .domain([0, bardata.length * 0.33, bardata.length * 0.66, bardata.length])
    .range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

var tooltip = d3.select('body').append('div')
    .style({
        'position': 'absolute',
        'padding': '0 10',
        'background': 'white',
        'opacity': 0
    })

var myChart5 = d3.select('#chart-1')
    .append("svg")
    .attr('width', 600)
    .attr('height', 400)
    .append('g')
    .selectAll("rect")
    .data(bardata)
    .enter().append("rect")
    .attr('width', xScale.rangeBand())
    .attr('x', function(d, i) {
        return xScale(i);
    })
    .attr('height', 0)
    .attr('y', height)
    .style('fill', function(d, i) {
        return colors(i);
    })
    .on('mouseover', function(d) {
        tooltip.transition()
            .style('opacity', .9)

        tooltip.html(d)
            .style('left', (d3.event.pageX - 35) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px')


        tempColor = this.style.fill;
        d3.select(this)
            .style({
                'opacity': 0.5,
                'fill': 'yellow'
            })
    })
    .on('mouseout', function(d) {
        d3.select(this)
            .style({
                'opacity': 1,
                'fill': tempColor
            })
    })

myChart5.transition()
    .attr('height', function(d) {
        return yScale(d);
    })
    .attr('y', function(d) {
        return height - yScale(d);
    })
    .delay(function(d, i) {
        return i * 20
    })
    .duration(1000)
    .ease('elastic')
