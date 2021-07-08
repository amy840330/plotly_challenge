function init(){
var dropdown = d3.select('#selDataset')
    var data = d3.json("samples.json")
    .then(function dropdownmenu(data){

        console.log(data);

        var samplenames=data.names;

        samplenames.forEach((sample) => {
            dropdown
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        var firstSample = samplenames[0];
        charts(firstSample);
        metadata(firstSample);
})
}

init();

function metadata(sample){

    var data = d3.json("samples.json")
    .then(function dropdownmenu(data){

    var meta = data.metadata;
    var metadata=meta.filter(optionid=>optionid['id']==sample)[0];
    
    var PANEL = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })
})
}

function charts(sample){
    var data = d3.json("samples.json")
    .then(function dropdownmenu(data){

        var sorted = data.samples.sort((a, b) => b.sample_values - a.sample_values);

        var samples = sorted;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
    
        var otu_ids = result.otu_ids.slice(0,10).reverse();
        var otu_labels = result.otu_labels.slice(0,10).reverse();
        var sample_values = result.sample_values.slice(0,10).reverse();
        
        var barData = [
            {
            y: otu_ids.map(otuID => `OTU ${otuID}`),
            x: sample_values,
            text: otu_labels,
            type: "bar",
            orientation: "h",
            }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
            };
        Plotly.newPlot("bar", barData, barLayout);

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
        };
        var bubbleData = [
            {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            }
        ];
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


})
}

function optionChanged(current_dropdown_option){
    charts(current_dropdown_option);
    metadata(current_dropdown_option);
}