const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

const req = new XMLHttpRequest();

let dataset = [];
let baseTemp;
const color = ["#02066F", "#247AFD", "#FDC1C5", "#D5174E"]
const legend = ["-2", "0", "2"]

let minYear;
let maxYear;

const w = 1200;
const h = 500;
const padding = 40;

let xScale;
let yScale;
let xScaleAxis;
let yScaleAxis;

const svg = d3.select(".container")
              .append("svg")

const svgLegend = d3.select(".container")
              .append("svg")
              .attr("width", 500)   
              .attr("height", 200)
             
                   

const drawSvg = ()=>{
              svg.attr("width", w)
              svg.attr("height", h) 
             
}

const generateScales = ()=>{

    minYear = d3.min(dataset, (d)=> d.year)
    maxYear = d3.max(dataset, (d)=> d.year)

        xScale = d3.scaleLinear()
                    .domain([minYear, maxYear+1])
                    .range([padding*3, w - padding])
                   
        yScale = d3.scaleTime()
                     .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                    .range([padding,h-padding])

}

const drawMultipleBars = ()=>{
    let nmOfYear = maxYear - minYear

    const divTooltip = d3.select(".container")
                         .append("div")
                         .attr("class", "tooltip")
                         .attr("id", "tooltip")
                         .style("opacity", 0)

 svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d)=>{
        if(d.variance <= -2){
            return '#02066F'
        }else if(d.variance <= 0){
            return '#247AFD'
        }else if(d.variance <=2){
            return '#FDC1C5'
        }else {
            return '#D5174E'
        }
    })
    .attr("data-month", (d)=>d.month - 1)
    .attr("data-year",(d)=>d.year)
    .attr("data-temp", (d)=>(baseTemp+d.variance))
    .attr("height", (h-padding*2)/12)
    .attr("width", (w-padding*2)/nmOfYear)
    .attr("y", (d)=>yScale(new Date(0, d.month-1, 0, 0, 0, 0, 0)))
    .attr("x", (d)=> xScale(d.year))
    .on("mouseover", function(event, d){
        const monthLabels = [
            "January", "February", "March", "April", "May", "June", "July", "August",
             "September", "October", "November", "December"
        ]

        divTooltip.style("opacity", 0.9)
                  .attr("data-year", d.year)
                  .html(
                  'Year: ' +
                  d.year +
                  ', Temperature: ' +
                  (baseTemp+d.variance) +' dégré' +'<br/>'+
                  'Month: ' +
                  monthLabels[[d.month]-1]
                  )
                  .style("left", event.pageX +"px")
                  .style("top", event.pageY -28 +"px")
    })
    .on("mouseout", function(){
        divTooltip.style("opacity", 0)
    })

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -300)
        .attr('y',60)
        .text('Months');
    
    svg.append('text')
        .attr('x', w/2)
        .attr('y', h)
        .text('Years');



svgLegend.attr("id", "legend") 
            .selectAll("rect")
            .data(color)
            .enter()
            .append("rect")
            .attr("x", (c,i)=> i*55 + 110)
            .attr("y", 0)
            .attr("width", 40)
            .attr("height", 40)
            .attr("fill", (c , i)=> c)
svgLegend.selectAll("text")
            .data(color)   
            .enter()
            .append("text")
            .attr("x", (c, i)=> i*55+110) 
            .attr("y", 60)
            .text((c)=>{
                if(c == color[0]){
                    return "T<=-2"
                }else if(c == color[1]){
                    return "T<=0"
                }else if(c == color[2]){
                    return "T<=2"
                }else{
                    return  "T>2"
                }
            })
            
            
           
   
}

const generateAxis = ()=>{
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))
                    svg.append("g")
                       .call(xAxis)
                       .attr("id", "x-axis")
                       .attr("transform", "translate(0,"+(h-padding)+")")
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"))
                    svg.append("g")
                    .call(yAxis)
                    .attr("id", "y-axis")
                    .attr("transform", "translate("+(padding*3)+",0)")
}    


req.open('GET', url, true);
req.send();
req.onload = ()=>{
    const data = JSON.parse(req.responseText);
    baseTemp = data.baseTemperature
    dataset = data.monthlyVariance;
    console.log(dataset)
    drawSvg();
    generateScales();
    drawMultipleBars();
    generateAxis();
}

