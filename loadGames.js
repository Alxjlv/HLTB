const hltb = require('howlongtobeat');
const jsonCache = require("./jsonCache");
const hltbService = new hltb.HowLongToBeatService();

const debugLimit = 1;
const sleepMax = 5;

async function main() {
    await jsonCache.createCache(true);

    let cache = jsonCache.getCache();

    for (let i =0; i < cache.games.length; i++) {
        let game = cache.games[i];
        if (game.main && game)
        console.log(game);
        let hltbData = await debouncedRequest(game.name, sleepMax);
        console.log(hltbData);
        game["main"] = hltbData[0].gameplayMain
        game["main&extra"] = hltbData[0].gameplayMainExtra
        game["completionist"] = hltbData[0].gameplayCompletionist
        game["hltbSimilarity"] = hltbData[0].similarity
        game["hltbName"] = hltbData[0].name
        console.log(cache.games[i])

        // limit how many times the function is run for debugging purposes
        if (i === (debugLimit - 1)){
            break;
        }
    }
    // jsonCache.saveCache(cache)
}

// debouncing calls to the service so that I don't get IP blocked for DDoSing lol
async function debouncedRequest(searchQuery, maxSleepSeconds) {
    let randomSleep = Math.floor(Math.random() * (maxSleepSeconds + 1)) * 1000;
    console.log("Sleeping for " + randomSleep + " milliseconds");
    await sleep(randomSleep);
    console.log("Searching for " + searchQuery);
    return await hltbService.search(searchQuery);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()


