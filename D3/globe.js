window.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle logic
    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e) => {
            let arrowParent = e.target.parentElement.parentElement; // selecting main parent of arrow
            arrowParent.classList.toggle("showMenu");
        });
    }

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    console.log(sidebarBtn);
    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        sidebar.classList.toggle("show");``
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
        .scale(150) // Adjust the scale for the size of the map
        .translate([width / 2, height / 1.5]); // Center the map

    const path = d3.geoPath().projection(projection);

    // Create a zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8]) // Define the zoom scale limits
        .on("zoom", zoomed);

    svg.call(zoom); // Apply zoom behavior to the SVG

    // Add graticule (lines of latitude and longitude)
    const graticule = d3.geoGraticule();

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#CCCCCC");

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
            .attr("fill", "#00ff00") // Green color for countries
            .attr("stroke", "#000"); // Border for countries

        // Tooltip for country names
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".country")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#ff5733"); // Highlight on hover
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.properties.name) // Show country name
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#00ff00"); // Reset color
                tooltip.transition().duration(500).style("opacity", 0);
            });
    });

    // Zooming functionality
    function zoomed(event) {
        svg.selectAll('path')
            .attr('transform', event.transform); // Apply zoom transformation
    }
});
