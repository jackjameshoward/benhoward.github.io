// Disable scrolling.
document.ontouchmove = function (e) {
  e.preventDefault();
}

// Where is the force chart attached in the DOM
var base = d3.select("#chart-1");

// Define color palette
var color = d3.scale.category10();

// Function needed to bring the text to the front of the Node group
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

// Call the json
d3.json("data.json", function(d) {

    // Load data to links and nodes
    nodes = d.nodes
    links = d.links

    // Create the svg
    var chart = base.append("svg")
        .attr("class", "img-fluid");

    // Create the links group
    var link = chart.append("g")
        .attr("class", "links")
        .selectAll("line").data(links)
        .enter().append("line");

    // Create the nodes group, creates a g tag for each node
    var node = chart.append("g")
        .attr("class", "nodes")
        .selectAll("g").data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("click", mouseover)
        .on("mouseout", mouseout)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Create the cirecle inside the the node g tag
    node.append("circle")
        .attr("r", 5);
        //.style("fill", function(d) { return color(d.type); })

    // Create svg text element inside the node g tag
    node.append("text")
        .text(function(d) {
            return d.id;
        })
        .attr("font-family", "Arial")
        .attr("text-anchor", "end")
        .style("visibility", "hidden");

    // Create the simulation
    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(links))
        .on("tick", ticked);
    // Set size of SVG and ceter the force layout
    resize();
    d3.select(window).on("resize", resize);

    // Define what moves in the simulation
    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }

    // Where the nodes move to when dragged
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function mouseover() {
        tempColor = this.style.fill;
        var sel = d3.select(this);

        sel.moveToFront();

        sel.select("circle").transition()
            .duration(750)
            .attr("r", 10)
            .style("fill", "lightsteelblue");

        sel.select("text").transition()
            .duration(750)
            .style("visibility", "visible");
    }

    function mouseout() {
        var sel = d3.select(this);

        sel.select("circle").transition()
            .duration(750)
            .attr("r", 5)
            .style("fill", tempColor);

        sel.select("text").transition()
            .duration(750)
            .style("visibility", "hidden");
    }

    function resize() {
        width = +base.style("width").replace('px', ''),
            height = +base.style("height").replace('px', '');
        chart.attr("width", width).attr("height", height);
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.restart();
    }
    // End of JSON call
}); // End of JSON call
// End of JSON call
