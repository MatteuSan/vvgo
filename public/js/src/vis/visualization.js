import {useCredits} from "./datasets";
import * as d3 from "d3";
import _ from "lodash";

export const ExampleVegaLite = (props) => {

}

export const drawBarChart = (svg, props) => {
    const {parts, title, height, width, margin} = props
    const insideWidth = width - margin.left - margin.right;
    const insideHeight = height - margin.top - margin.bottom;
    svg.attr("viewBox", [0, 0, width, height])


    const data = d3.flatRollup(parts, v => v.length, d => d.Project)
        .map(([Project, Count]) => ({Project, Count}))
    data.sort((a, b) => a.Project > b.Project ? 1 : -1)
    const xAttr = "Project";
    const yAttr = "Count";

    const x = d3
        .scaleBand()
        .domain(_.uniq(data.map(p => p.Project)))
        .range([0, insideWidth])
        .padding(0.05);

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, p => p.Count))
        .range([insideHeight, 0]);

    const line = d3
        .line()
        .x((d) => x(d[xAttr]) + x.bandwidth() / 2)
        .y((d) => y(d[yAttr]));

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("text")
        .text(title)
        .style("font-size", "x-large")
        .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

    g.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d[xAttr]))
        .attr("width", (d) => x.bandwidth())
        .attr("y", (d) => y(d[yAttr]))
        .attr("height", (d) => insideHeight - y(d[yAttr]))
        .attr("fill", "#adc2eb");

    g.selectAll(".point")
        .data(data)
        .join("circle")
        .attr("class", "point")
        .attr("cx", (d) => x(d[xAttr]) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d[yAttr]))
        .attr("r", 2)
        .attr("fill", "black");

    g.append("path")
        .datum(data)
        .attr("d", (d) => line(d))
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    g.selectAll(".countText")
        .data(data)
        .join("text")
        .text((d) => d.Count)
        .attr("class", "countText")
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d[xAttr]) + x.bandwidth() / 2)
        .attr("y", (d) => y(d[yAttr]) - 15);

    g.append("g")
        .attr("transform", `translate(0, ${insideHeight})`)
        .style("font-size", "xx-small")
        .call(d3.axisBottom(x)).selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-60)")
        .style("text-anchor", "end")
}
