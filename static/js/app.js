//************************************************
// To initiate web site:  
// python -m http.server
//************************************************


var samples = [];

var selectedDataset;

//-----------------------------------------------------
// Initialization and Setup
function init() {
    console.log("starting init");
    d3.json("/samples.json").then(function (data) {
        samples = data;
        console.log("samples.json", samples);

        PopulateSelect();
    });

    console.log("init ending");
}

// Populate the select drop down for the data sets
function PopulateSelect() {
    var datasetNames = samples.names;
    console.log("datasetNames", datasetNames);

    var selDataset = d3.select("#selDataset");
    options = selDataset.selectAll("option").data(datasetNames).enter().append("option")
        .text(function (d) { return d; })
        .attr("value", function (d) { return d });

    // Take the first value and treat it as a change event
    selectedDataset = selDataset.property("value");
    optionChanged(selectedDataset);
}

//------------------------------------------------
// Events
function optionChanged(value) {
    selectedDataset = value;
    console.log("selectedDataset", selectedDataset);

    LoadDemographicInfo(selectedDataset);
    LoadBarChart(selectedDataset);
    LoadBubbleChart(selectedDataset);
    LoadPieChart(selectedDataset);
}

//--------------------------------------------------
// Mapping Filters
function FilterByDatasetID(record) {
    return record.id == selectedDataset;
}

//--------------------------------------------------
// Load Graphic Methods


// Populate the bar chart.
function LoadBarChart(selectedDataset) {
    // * Use `sample_values` as the values for the bar chart.
    // * Use `otu_ids` as the labels for the bar chart.
    // * Use `otu_labels` as the hovertext for the chart.
    var barSamples = samples.samples.filter(FilterByDatasetID)[0];

    console.log("barSamples", barSamples);
    // Take just top 10 of values
    var top10Samples = barSamples.sample_values.slice(0, 10).reverse();
    console.log("top10Samples", top10Samples);
    var top10Ids = barSamples.otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse();
    console.log("top10Ids", top10Ids);
    var top10Labels = barSamples.otu_labels.slice(0, 10).reverse();
    console.log("top10Labels", top10Labels);


    // Trace1 for the top 10 samples
    var Trace1 = {
        y: top10Ids,
        x: top10Samples,
        text: top10Labels,
        type: 'bar',
        orientation: 'h'
    };

    // data
    var data = [Trace1];

    // No title
    var layout = {
    };

    Plotly.newPlot("bar", data, layout);
}

function LoadGaugeChart(wfreqNum) {
    // part of data to input

    console.log("staring LoadGuageChart", wfreqNum);
    var traceGauge = {
        type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        name: "Washing Frequency",
        values: [81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81],
        text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['', '', '', '', '', '', '', '', '', 'white'],
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
            hoverinfo: 'label'
        }
    }

    /*
        For a circle with origin (j, k) and radius r:

        x(t) = r cos(t) + j
        y(t) = r sin(t) + k

        where you need to run this equation for t taking values within the range from 0 to 360, then you will get your x and y each on the boundary of the circle.
    */

    var originX = .5;
    var originY = .5;

    // // x1 = radius * Math.cos(Math.PI / 9) + originX;
    // // y1 = radius * Math.sin(Math.PI / 9) + originY;
    // // needle
    // var degrees = 180, radius = .2;
    // var radians = wfreqNum * Math.PI / 9;
    // console.log("radians", radians);
    // var x1 = 1 + Math.cos(radians);
    // var y1 = Math.sin(radians);

    var wfFreqRanges = [{ "x": .32, "y": .5 },
    { "x": .336, "y": .575 },
    { "x": .355, "y": .66 }, 
    { "x": .412, "y": .708 }, // *
    { "x": .47, "y": .715 },
    { "x": .53, "y": .718 },
    { "x": .588, "y": .710},
    { "x": .638, "y": .65}, 
    { "x": .665, "y": .578},
    { "x": .71, "y": .5}
    ];

    var coords = wfFreqRanges[wfreqNum];
    x1 = coords.x;
    y1 = coords.y;
    // var x1 = -1 * radius * Math.cos(radians);
    // var y1 = radius * Math.sin(radians);
    console.log("x1, y1", x1, y1);
    /*
    {
            type: 'line',
            x0: originX,
            y0: originY,
            x1: x1,
            y1: y1,
            line: {
                color: 'black',
                width: 3
            }
            }, */

    var gaugeLayout = {
        shapes: [
            {
                opacity: 0.6,
                type: 'path',
                path: `M ${x1}, ${y1}, L ${originX}, ${originY + .02}, L ${originX}, ${originY - .02}, L ${x1}, ${y1} Z`,
                fillcolor: 'purple',
                line: {
                    opacity: 0.3,
                    color: 'purple'
                }
            },
            {
                type: 'circle',
                x0: originX + .01,
                y0: originY + .02,
                x1: originX - .01,
                y1: originY - .02,
                fillcolor: 'blue',
                opacity: 0.75
            }
        ],
        title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        xaxis: { visible: false, range: [-1, 1] },
        yaxis: { visible: false, range: [-1, 1] }
    }

    var dataGauge = [traceGauge]

    Plotly.newPlot('gauge', dataGauge, gaugeLayout)
}

function LoadBubbleChart(selectedDataset) {
    // * Use `otu_ids` for the x values.
    // * Use `sample_values` for the y values.
    // * Use `sample_values` for the marker size.
    // * Use `otu_ids` for the marker colors.
    // * Use `otu_labels` for the text values.
    var bubbleSamples = samples.samples.filter(FilterByDatasetID)[0];
    console.log("bubbleSamples", bubbleSamples);

    // colors need to be based on something unique, so use otu ids

    var Trace1 = {
        x: bubbleSamples.otu_ids,
        y: bubbleSamples.sample_values,
        text: bubbleSamples.otu_labels,
        mode: 'markers',
        marker: {
            color: bubbleSamples.otu_ids.map(x => `rgb(${255 - x % 255}, ${x % 255}, ${255 - x % 255})`),
            size: bubbleSamples.sample_values
        }
    };

    var data = [Trace1];

    layout = {
        xaxis: {
            title: "OTU ID"
        }
    };

    Plotly.newPlot("bubble", data, layout);
}

function LoadDemographicInfo(selectedDataset) {
    var metaData = samples.metadata.filter(FilterByDatasetID)[0];
    console.log("metaData", metaData);

    var sampleMetaData = d3.select("#sample-metadata");
    console.log("sampleMetaData", sampleMetaData);
    sampleMetaData.selectAll("table").remove();
    var table = sampleMetaData.append("table");
    table.append("tr").append("td").text(`id: ${selectedDataset}`);
    table.append("tr").append("td").text(`ethnicity: ${metaData.ethnicity}`);
    table.append("tr").append("td").text(`gender: ${metaData.gender}`);
    table.append("tr").append("td").text(`age: ${metaData.age}`);
    table.append("tr").append("td").text(`location: ${metaData.location}`);
    table.append("tr").append("td").text(`bbtype: ${metaData.bbtype}`);
    table.append("tr").append("td").text(`wfreq: ${metaData.wfreq}`);
    console.log("sampleMetaData", sampleMetaData);

    LoadGaugeChart(metaData.wfreq);

}

function LoadPieChart(selectedDataset) {
    console.log("selectedDataset", selectedDataset);
    var pieSamples = samples.samples.filter(FilterByDatasetID)[0];
    console.log("pieSamples", pieSamples);

    var top10SampleValues = pieSamples.sample_values.slice(0, 10);
    console.log("top10SampleValues", top10SampleValues)

    var top10Ids = pieSamples.otu_ids.slice(0, 10);
    console.log("top10Ids", top10Ids);

    var top10Labels = pieSamples.otu_labels.slice(0, 10);
    console.log("top10Labels", top10Labels);

    var Trace1 = {
        values: top10SampleValues,
        labels: top10Ids,
        text: top10Labels,
        textinfo: 'percent',
        hoverinfo: 'text',
        type: "pie"
    };

    var data = [Trace1];

    var layout = {

    }

    Plotly.newPlot("pie", data, layout);
}

init();