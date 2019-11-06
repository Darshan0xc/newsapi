const request = require('request');
const fs = require('fs');

var defaults;

//Getting News From newsapi.org
var getNews = (newsSource, lang, callback) => {
    //console.log("Language: " + lang);
    var endpoint = 'https://newsapi.org/v2/top-headlines?' +
                    'sources=' + newsSource + '&apiKey=<YOURAPIKEY>' +
                    '&language=' + lang;
    endpoint = encodeURI(endpoint);
    console.log(endpoint);
    request({
        url: endpoint
    }, function(error, response, body) {
        if(error) {
            callback(undefined, "API Response Failed. Some Error in getting articles");
        } else {
            var gotArticles = JSON.parse(body);
            //console.log(articles);
            // console.log("---------------Into the newsapi.js File---------------");
            // console.log(gotArticles.articles[0].title);
            // console.log(gotArticles.articles[0].publishedAt);
            callback(gotArticles, gotArticles.status);
        }
    });
};

function printNews(newsNetwork='the-next-web', noOfArticles=1, lang='en') {
    getNews(newsNetwork, lang, (articles, status) => {
        
        //console.log(articles.articles.length);
        //console.log(articles.status !== "ok");
        
        if(articles.status === 'error' && articles.code === "sourceDoesNotExist") {
            console.log(articles.message);
            console.log("Please use --n_list command to get the list of supported news networks");
        } else {
            if(articles.articles.length === 0) {
                //Previous Condition: (articles.status !== "ok") 
                var msg = "No News Articles Found";
                lang !== 'en' ? console.log(msg + " for Language: " + lang) : console.log(msg + ".");
            } else {
                console.log();
                var flag;
                
                //First Condition:-
                //Checking whether there are more than 1 news networks passed...
                //If Semicolon is Found Then Return 'true' otherwise 'false'
                //if semicolon found means there are multiple networks passed...
                //Second Condition:-
                //Checking whether first article's source matches with news network...
                flag = (newsNetwork.indexOf(',') > -1) || (newsNetwork.indexOf(articles.articles[0].source.id) > -1);
                //console.log(flag);
                
                if (!flag) {
                    console.log("Wrong articles were fetched. Looks like there is some error in API");
                    console.log("Source Requested: " + newsNetwork);
                    console.log("Source Received : " + articles.articles[0].source.id);
                } else {
                    console.log("All news articles sorted by: top");
                    
                    //Checking Whether The Flag Has Been set or Not...
                    if(noOfArticles === "all" || (newsNetwork.indexOf(',') > -1)) {
                        noOfArticles = articles.articles.length
                    }
                    
                    if(noOfArticles > articles.articles.length) {
                        console.log();
                        console.log("Articles Returned By News Network : " + articles.articles.length);
                        console.log("But Requested No of Articles are  : " + noOfArticles);
                        console.log("Application Falling Back...Setting No of Articles To The No of Articles Received...");
                        noOfArticles = articles.articles.length;
                        console.log();
                    }
                    //(newsNetwork.indexOf(',') > -1) ? noOfArticles = articles.articles.length : console.log();
                    
                    articlePrinter(articles, noOfArticles);
                }
            } 
        }
    });
}

var lang_array = {
    "ar" : "Arabic",
    "en" : "English",
    "cn" : "Chinese",
    "de" : "German",
    "es" : "Spanish",
    "fr" : "French",
    "he" : "Hebrew", 
    "it" : "Italian", 
    "nl" : "Dutch", 
    "no" : "Norwegian", 
    "pt" : "Portuguese", 
    "ru" : "Russian", 
    "sv" : "Swedish", 
    "ud" : "Urdu"
};

var country_array = {
    "ar": "United Arab Emirates",
    "au": "Australia",
    "br": "Brazil",
    "ca": "Canada",
    "cn": "China",
    "de": "Germany",
    "es": "Spain",
    "fr": "France",
    "gb": "England",
    "hk": "Hong Kong",
    "ie": "Ireland",
    "in": "India",
    "is": "Iceland",
    "it": "Italy",
    "nl": "Netherlands",
    "no": "Norway",
    "pk": "Pakistan",
    "ru": "Russia",
    "sa": "Saudi Arabia",
    "sv": "El Salvador",
    "us" : "United States"
};

//Getting News Based on Category, Language and Query From newsapi.org ...
var getCatQuery = (q, cat, lang, callback) => {
    
    var endpoint = "https://newsapi.org/v2/";
    
    if(q !== undefined) {
        console.log("Entering Query Gathering Engine...");
        console.log("Language: " + lang_array[lang]);
        endpoint = endpoint + "everything?q=" + q + 
                            "&sortBy=relevancy&language=" + lang + 
                            "&apiKey=f6771335c770401abd938e5efe46515e";
        endpoint = encodeURI(endpoint);
        //console.log(endpoint);
    } else if(cat !== undefined) {
        console.log("Entering Category Based Engine...");
        console.log("Language: " + lang_array[lang]);
        //console.log("Country: " + country_array[country]);
        endpoint = endpoint + "top-headlines?category=" + cat 
                            + "&sortBy=publishedAt&apiKey=f6771335c770401abd938e5efe46515e" 
                            + "&language=" + lang; //+ "&country=" + country;
        //console.log(endpoint);
    } else {
        console.log("No Required Arguments are Passed.");
        console.log("Falling back...Printing Default Behaviour");
        printNews();
        return;
    }
    console.log(endpoint);
    request({
        url: endpoint
    }, function(error, response, body) {
        if (error) {
            console.log(error, undefined);
        } else {
            //body = JSON.parse(undefined, body);
            var articles = JSON.parse(body);
            callback(undefined, articles);
            //console.log("Body: " + typeof body);
            //console.log(undefined, body);
            //console.log("Articles: " + typeof articles);
        }
    });
};

function getCustomNAPI(q, cat, lang="en", total=10) {
    getCatQuery(q, cat, lang, (error, articles) => {
        if(error !== undefined) {
            console.log(error);
        } else {
            if (articles.articles.length <= 0) {
                var msg = "No Articles Found";
                lang != 'en' ? msg += " For " + lang_array[lang] + " Language" : msg = msg ;
                // country !== 'us' ? msg += " and For Country " + country_array[country] + ". Please Make Necessary Changes" :
                //                     msg += ". Please Make Necessary Changes";
                console.log(msg);
            } else {
                console.log("Total: " + total);
                
                //Checking passed Total parameter..
                //typeof total !== "number" ? total = 10 : console.log();
                ((total === "all") || (total > articles.articles.length)) ? total = articles.articles.length : total = Number(total);
                articlePrinter(articles, total);
            }
            //console.log(JSON.stringify(articles, undefined, 4));
        }
    });
}

function articlePrinter(articles, total) {
    for(var i=1 ; i<=total ; i++) {
        var dateIterated = new Date(Date.parse(articles.articles[i-1].publishedAt)).toDateString();
        console.log("========Article:"+i+"=========");
        var farticle = {
            site: articles.articles[i-1].source.name,
            url: articles.articles[i-1].url,
            title: articles.articles[i-1].title,
            author: articles.articles[i-1].author,
            published: dateIterated,
            image: articles.articles[i-1].urlToImage
        };
        //fs.appendFileSync('./articles.json', JSON.stringify(farticle, undefined, 4));
        console.log("Article Title: " + ((farticle.title === null) ? "Not Available" : farticle.title));
        console.log("Article Link: " + ((farticle.url === null) ? "Not Available" : farticle.url));
        console.log("Author: " + ((farticle.author === null) ? "Not Available" : farticle.author));
        console.log("Image URL: " + ((farticle.image === null) ? "Not Available" : farticle.image));
        console.log("Article Published: " + ((farticle.published === null) ? "Not Available" : farticle.published));
        console.log("Source: " + ((farticle.site === null) ? "Not Available" : farticle.site));
        console.log("========End========");
    }
}

//Getting news from custom api engine of webhose.io
var customNews = (query, days, callback) => {
    if(days > 30 || days < 0) {
        console.log("Entered Days More Than 30...Setting it to 30 by default...");
        days = 30;
    }
    var d = new Date();
    console.log("Current Date: " + d.toDateString());
    d.setDate(d.getDate() - days);
    console.log("Subtracted Date: " + d.toDateString());
    var endpoint = "http://webhose.io/filterWebContent?token=87fdc136-8145-4667-9343-e5d92458dad3&format=json&ts=" + d.getTime() + "&sort=relevancy&q=" + query;
    var filter =  ` language:english site_type:news thread.title:${query}`;
    endpoint = encodeURI(endpoint + filter);
    //console.log(endpoint);
    
    request({
        url: endpoint
    },(error, response, body) => {
        if(error) {
            console.log(error);
        } else {
            callback(JSON.parse(body));
            //console.log("First Post Title: " + gotNews.posts[0].thread.title);
            //console.log(gotNews);
        }
    });
};

function getCustomNews(query, days=1, noOfArticles=5) {
    customNews(query, days,(gotNews) => {
        if (JSON.parse(gotNews.totalResults) === 0) {
            console.log("No Articles Found...");
            return;
        }
        for(var i=1; i<=noOfArticles; i++) {
            var dateIterated = new Date(Date.parse(gotNews.posts[i-1].thread.published));
            //console.log(dateIterated.toDateString());
            var farticle = {
                url: gotNews.posts[i-1].thread.url,
                title: gotNews.posts[i-1].thread.title,
                published: dateIterated,
                image: gotNews.posts[i-1].thread.main_image
            };
            
            console.log("========Article:"+i+"========");
            console.log("Article Title: " + farticle.title);
            console.log("Article Link: " + farticle.url);
            console.log("Image URL: " + farticle.image);
            console.log("Article Published: " + farticle.published);
            console.log("========End========");
        }
    });
}

module.exports = {
    printNews,
    getCustomNews,
    getCatQuery,
    getCustomNAPI
};
//module.exports.getNews = getNews;

//Correct Portion
// var endpoint = "https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=8d4aa30fb1dc401ca53fa5c8345ca777";
//     request({
//         url: endpoint
//     }, function(error, response, body) {
//         if(error) {
//             callback(undefined, "Some Error in getting articles");
//         } else {
//             var gotArticles = JSON.parse(body);
//             //console.log(articles);
//             console.log("---------------Into the newsapi.js File---------------");
//             console.log(gotArticles.articles[0].title);
//             console.log(gotArticles.articles[0].publishedAt);
//             callback(gotArticles, gotArticles.status);
//         }
//     });