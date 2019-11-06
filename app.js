//Node Packages
const request = require('request');
const yargs = require('yargs');
const fs = require('fs');
const extfs = require('extfs');
//Local Inclusions
const newsapi = require('./news-controller/newsapi');
const sourceAvailable = require('./source/printSource');
const clock = require('./news-controller/clock');
const weather = require('./weather/weather');

var argv = yargs
    .options({
        news_network: {
            alias: 'n',
            describe: 'Choose News Network From the Available.\n',
            string: true
        },
        network_available: {
            alias: 'n_list',
            describe: 'Prints all news networks available.\n',
            string: true
        },
        category: {
            alias: 'c',
            describe: 'Choose What Category of News You Want? \n',
            string: true
        },
        weather: {
            alias: 'w',
            describe: 'Enter Your Address, City, Country,\n or Any Area Name And Get The Live Weather Report.\n',
            string: true
        },
        total_articles: {
            alias: 't',
            describe: 'How Many Articles Do You Want?\n [Used With -n and -k commands]\n',
            string: true
        },
        keyword: {
            alias: 'k',
            describe: 'Enter Custom Keyword To Find News \nBased on Custom Keyword\n',
            string: true
        },
        backdays: {
            alias: 'back',
            describe: 'Days to look back \n[Defaulut = 1, Max = 30] \n [Must be passed with -k argument]\n',
            string: true
        },
        release_notes: {
            alias: 'release',
            describe: 'Updates and information related to app\n',
            string: true
        },
        set_default: {
            alias: 'set_d',
            describe: 'Set default settings for app \nlike language, source, noOfArticles etc\n',
            string: true
        },
        language: {
            alias: 'lang',
            describe: 'Set language in which articles \nshould be returned,\n and It\'s a experimental feature.\n',
            string: true
        },
        country: {
            alias: 'cn',
            describe: 'Set country for which you want to\n fetch the news.\n Language must match with country. \n[Under Construction]',
            string: true
        },
        clock: {
            alias: 'clk',
            describe: 'Shows You Current Date and Time in UTC\n [Under Construction]',
            string: true
        }
    })
    .version()
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .argv;

if(argv.weather !== undefined) {
    //console.log("---:Notice:---");
    //console.log("Weather Command only Works Alone or With Default Values Right Now.");
    //console.log("You Can't Get News Articles Along With It, as It Generates Result Greater Than Screen Requirements");
    argv.weather === "" ? argv.weather = "New York, USA" : console.log();
    weather.getLatLong(argv.weather);
}

if (argv.n_list !== undefined) {
    
    sourceAvailable.printNewsNetwork();

} else if(argv.set_d !== undefined) {
    
    console.log("Please Confirm That You Entered All The Required Parameters,\n" +
                "Otherwise It Won't Work as Expected and Default App Settings Will be Saved.");
    console.log("Setting Parameters as Shown Below: ");
    
    argv.n !== undefined ? argv.n = argv.n.split(' ').join('-').toLocaleLowerCase() : console.log();
    //console.log("File Empty?: " + extfs.isEmptySync('./defaults.json'));
    if (extfs.isEmptySync('./defaults.json')) {
        console.log("Empty File Block");
        setDefaults(argv.lang, argv.t, argv.n);
        console.log("Source: " + argv.n);
        console.log("Language: " +  argv.lang);
        console.log("No of Articles: " + argv.n);
    } else {
        console.log("Non Empty File Block");
        var obj = readDefaults();
        //var obj = JSON.parse(fs.readFileSync("defaults.json"));
        (obj.source !== undefined) && argv.n === undefined ? argv.n = obj.source : console.log();
        (obj.lang !== undefined) && argv.lang === undefined ? argv.lang = obj.lang : console.log();
        (obj.no !== undefined) && argv.t === undefined ? argv.t = obj.no : console.log();
        console.log("Source: " + argv.n);
        console.log("Language: " +  argv.lang);
        console.log("No of Articles: " + argv.t);
        setDefaults(argv.lang, argv.t, argv.n);
    }
    
} else if(argv.c != undefined) {
    
    // console.log("This section of app is under construction");
    // process.exit();
    newsapi.getCustomNAPI(undefined, argv.c, argv.lang, argv.t);
    
} else if(argv.release != undefined) {
    
    var notes = fs.readFileSync('./release.json');
    notes = JSON.stringify(JSON.parse(notes), undefined, 4);
    console.log(notes.replace(/[-]+/g, "\n\t\t\t\t").replace(/[{}'",]+/g, ''));
    
}else {
    
    if(argv.n !== undefined) {
        argv.n = argv.n.split(' ').join('-').toLocaleLowerCase();
        console.log(argv.n);
        newsapi.printNews(argv.n, argv.t, argv.lang);
    } else if(argv.k !== undefined) {
        
        newsapi.getCustomNAPI(argv.k, undefined, argv.lang, argv.t);
        //newsapi.getCustomNews(argv.k, argv.back, argv.t);
        
    } else if(argv.clk !== undefined) {
        clock.updateClock();
    } else {
        var empty = extfs.isEmptySync('./defaults.json');
        if(!empty) {
            
            //Checking Weather the "weather" Parameter is set or not.
            //If Not Then Continues to Print Articles From Default Values.
            if(argv.w !== undefined) {
                console.log();
            } else {
                //Reading Default Values.
                var obj = readDefaults();
                
                //Printing Default Values.
                printDefaults();
                // obj = JSON.parse(obj);
                // console.log("Printing news as saved default settings...");
                // console.log("Source: " + obj.source);
                // console.log("Language: " +  obj.lang);
                // console.log("No of Articles: " + obj.no);
                
                //Calling newsapi Function To Print Articles.
                newsapi.printNews(obj.source, obj.no, obj.lang);
            }
            
        } else {
            if(argv.weather === undefined) {
                console.log("Please Enter Atleast one of the Following Arguments...");
                console.log('--news_network');
                console.log('--network_available');
                console.log('--set_d');
                console.log('Or To Get Help Pass --help');
            }
        }    
    }
}

function readDefaults() {
    if (extfs.isEmptySync('./defaults.json')) {
        console.log("No Default Data is Available... Please Set Some Default Values First...");
    } else {
        var obj = fs.readFileSync('defaults.json');
        obj = JSON.parse(obj);
        //console.log(JSON.stringify(obj, undefined, 4));
        return obj;
    }
}

function printDefaults() {
    var obj = readDefaults();
    obj = JSON.stringify(obj, undefined, 4);
    console.log(obj.replace(/[{}'",]+/g, ''))
}

function setDefaults(lang, no, s) {
    if(s!==undefined)
        s = s.split(' ').join('-').toLocaleLowerCase();
    var obj = {
        "lang": lang || 'en',
        "no": no || '5',
        "source": s || 'bbc-news'
    };
    obj = JSON.stringify(obj, undefined, 4);
    fs.writeFileSync('defaults.json', obj);
}

//---------------
//Testing Area
//---------------
// console.log('Passed News Network: ' + argv.n);
// console.log('Passed Category: ' + argv.c);
// console.log('Passed No. of Articles: ' + argv.t);


//sourceAvailable.getSources();