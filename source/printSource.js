const request = require('request');
var getSources = () => {
    var endpoint = "https://newsapi.org/v2/sources?language=en&apiKey=f6771335c770401abd938e5efe46515e";
    //console.log(endpoint);
    request({
        url: endpoint
    }, function(error, response, body) {
        if(error) {
            var msg;
            error.code === "ENOTFOUND" ? msg = "API Call Failed. Please Check API Host." : msg = "Unknown Error Occured.";
            console.log(msg);
        } else {
            var sourceList = JSON.parse(body);
            if(sourceList.status === "error" && sourceList.code === "apiKeyInvalid") {
                console.log("Invalid API Key. Please Update The API Key...");
            } else {
                if(sourceList.code !== "apiKeyInvalid") {
                    console.log(sourceList.message);
                }
                //console.log(sourceList);
                //console.log(sourceList.sources.length);
                //console.log(sourceList.sources[0].id);
                console.log("--------====-------");
                console.log("Printing all the news network available");
                for(var i=0; i<sourceList.sources.length; i++) {
                    console.log("---------------------------");
                    console.log("Source name: " + sourceList.sources[i].name + 
                                "\nID: " + sourceList.sources[i].id + 
                                "\nCategory: " + sourceList.sources[i].category);
                    console.log("---------------------------");
                }
                console.log("Total News Networks: " + sourceList.sources.length);
            }
        }
    });
};

function printNewsNetwork() {
    getSources();
}

module.exports = {
    printNewsNetwork
};