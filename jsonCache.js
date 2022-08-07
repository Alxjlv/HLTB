const fs = require("fs");
const { parse } = require("csv-parse");

const cacheFile = "gamesCache.json"

function createCache(override) {
    try {
        getCache();
        if(!override){
            return;
        }
    } catch (e) {
        if (e instanceof CacheError) {
            console.log(e.message);
        } else {
            throw e;
        }
    }

    // load in list of games
    // found from https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv
    // also using https://stackoverflow.com/a/58431762 for waiting on file writing
    return new Promise(function (resolve, reject){
        console.log("Creating cache");
        let json = {
            "games": []
        }
        fs.createReadStream("games.csv")
            .pipe(parse({ delimiter: "\t", from_line: 2}))
            .on("data", function (row) {
                json.games.push({
                    "name": row[0],
                    "currentHours": row[1],
                    "platform": row[2]
                });
            }).on("end", function (){
                console.log("finished parsing csv");

                // save json file to disk
                saveCache(json);
                resolve()
            }).on('error', reject)
    })
}

function getCache() {
    let errorString = "";
    let cache;
    try {
        // found from https://stackabuse.com/reading-and-writing-json-files-with-node-js/
        let currentCacheRaw = fs.readFileSync(cacheFile).toString();
        let currentCache = JSON.parse(currentCacheRaw);

        if (currentCache.games.length === 0) {
            errorString = "Cache is empty";
        } else {
            cache = currentCache;
        }
    } catch (e) {
        if(e.toString().includes("no such file or directory, open 'gamesCache.json'")) {
            errorString = "Cache does not exist";
        } else {
            console.log("Cache access errored");
            throw e;
        }
    }
    if (errorString !== "") {
        throw new CacheError(errorString);
    }
    return cache;
}

function saveCache(updatedCache) {
    let jsonString = JSON.stringify(updatedCache, null, 2);
    fs.writeFileSync(cacheFile, jsonString);
    console.log("Cache saved to disk")
}

class CacheError extends Error {
    constructor(message) {
        super(message);
        this.name = "CacheError";
    }
}


module.exports = {
    createCache,
    getCache,
    saveCache
}