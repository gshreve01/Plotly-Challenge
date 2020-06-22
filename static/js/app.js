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
    d3.json("/samples.json").then(function(data) {
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
    var barSamples = samples.samples.filter(FilterByDatasetID)[0];
    console.log("barSamples", barSamples);   
    // Take just top 10 of values
    var top10Samples = barSamples.sample_values.splice(0, 10).reverse();
    console.log("top10Samples", top10Samples);
    var top10Ids = barSamples.otu_ids.splice(0, 10).map(x => `OTU ${x}`).reverse();
    console.log("top10Ids", top10Ids);    
    var top10Labels = barSamples.otu_labels.splice(0, 10).reverse();
    console.log("top10Labels", top10Labels);
    
    
    // Trace1 for the top 10 samples
    var Trace1 = {
        y: top10Ids,
        x: top10Samples,
        type: 'bar',
        orientation: 'h'
    };

    // data
    var data = [Trace1];

    // No title
    var layout = {
    }

    Plotly.newPlot("bar", data, layout);

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
 
    // sampleMetaData.data([1]).enter().append("p").text(`id: ${metaData.id}`);
}

init();