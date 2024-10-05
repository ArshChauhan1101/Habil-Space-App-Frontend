window.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle logic
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");

    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        sidebar.classList.toggle("show");
    });

    // Interactive 2D world map with D3.js
    const width = 800;
    const height = 600;

    // Create an SVG container for the map
    const svg = d3.select("#globe")
        .attr("width", width)
        .attr("height", height);

    // Define a projection (Mercator for 2D world map)
    const projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Create a zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.call(zoom);

    // Load world map data (GeoJSON format)
    d3.json("https://d3js.org/world-110m.v1.json").then(function(world) {
        const countries = topojson.feature(world, world.objects.countries);

        // Draw the countries on the map
        svg.append("g")
            .selectAll("path")
            .data(countries.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", "#00ff00")
            .attr("stroke", "#000");

        // Tooltip for country names
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".country")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#ff5733");
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.properties.name)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#00ff00"); // Reset color
                tooltip.transition().duration(500).style("opacity", 0); // Fade out tooltip
            });
    });

    function zoomed(event) {
        svg.attr("transform", event.transform);
    }
});
