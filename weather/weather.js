const request = require('request');

var getLatLong = (address = "New York, USA") => {
    var endpoint = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address;
    endpoint = encodeURI(endpoint);
    console.log(endpoint);
    request({
        url: endpoint,
        json: true
    }, (error, response, body) => {
        if(error) {
            console.log(error);
        } else {
            //console.log("Latitude: " + body.results[0].geometry.location.lat);
            //console.log("Longitude: " + body.results[0].geometry.location.lng);
            var info = {
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng,
            };
            printWeather(info);
        }
    });
};

var getWeatherInfo = (info, callback) => {
    var endpoint = 'https://api.darksky.net/forecast/1d04bce87ab9fccce6398d25bb53c751/'+info.latitude+','+info.longitude;
    endpoint = encodeURI(endpoint);
    console.log(endpoint);
    request({
        url: endpoint,
        json: true
    }, (error, response, body) => {
        if(error) {
            callback('Unable to connect to the server', undefined);
        } else if(response.statusCode === 400) {
            callback('Unable to fetch weather', undefined);
        } else if(response.statusCode === 200) {
            //console.log(body);
            callback(undefined, body);
        }
    });
}

function printWeather(info) {
    //console.log(info);
    getWeatherInfo(info, (error,weather) => {
        if(error) {
            console.log(error);
        } else {
            //weather = JSON.parse(weather);
            //console.log(weather);
            console.log();
            console.log("==============Weather Report==============");
            console.log(`It is currently ${weather.currently.temperature}, It feels like ${weather.currently.apparentTemperature} .`);
            console.log("Summary: " + weather.daily.summary);
            console.log('Humidity: ', weather.currently.humidity);
            console.log('Pressure: ', weather.currently.pressure, 'pascal');
            console.log('Wind Speed: ', weather.currently.windSpeed, 'mph');
            console.log('UV-Ray Index: ', weather.currently.uvIndex, 'mJ/cm2');
            console.log('Visibility: ', weather.currently.visibility, 'meter');
            console.log('Ozone Layer: ', weather.currently.ozone, 'dobson');
            console.log("==========================================");
        }
    });
}

module.exports = {
    getLatLong
}