const fs = require("fs");
const { parse } = require("csv-parse");

function createCache(override) {
    try {
        let currentCacheRaw = fs.readFileSync('gamesCache.json').toString()
        let currentCache = JSON.parse(currentCacheRaw)

        if (currentCache.games.length > 0 && !override) {
            console.log("No override & cache already exists")
            return
        }
    } catch (e) {
        if(e.toString().includes("no such file or directory, open 'gamesCache.json'")) {
            console.log("Cache did not exist, creating")
        } else {
            console.log(e)
            console.log("Cache errored")
        }
    }

    let json = {
        "games": []
    }
    console.log("Creating cache")
    // load in list of games
    fs.createReadStream("games.csv")
        .pipe(parse({ delimiter: "\t", from_line: 2}))
        .on("data", function (row) {
            json.games.push({
                "name": row[0],
                "current hours": row[1],
                "platform": row[2]
            })
        }).on("end", function (){
            console.log("finished parsing csv")

            // save json file to disk
            let jsonString = JSON.stringify(json, null, 2)
            fs.writeFileSync('gamesCache.json', jsonString)
        })
}

module.exports = createCache