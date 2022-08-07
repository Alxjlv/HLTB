const hltb = require('howlongtobeat');
const jsonCache = require("./jsonCache");
const hltbService = new hltb.HowLongToBeatService();

const sleepMax = 5;

async function main() {
    await jsonCache.createCache(false);

    let cache = jsonCache.getCache();
    
    for (let i = 0; i < cache.games.length; i++) {
        let game = cache.games[i];

        // cache hit
        if (game["main"] !== undefined && game["mainExtra"] !== undefined && game["completionist"] !== undefined) {
            console.log("Cache hit - skipping to the next game")
            continue;
        }
        let hltbData = await debouncedRequest(game.name, sleepMax);

        game["main"] = hltbData[0].gameplayMain
        game["mainExtra"] = hltbData[0].gameplayMainExtra;
        game["completionist"] = hltbData[0].gameplayCompletionist;
        game["hltbSimilarity"] = hltbData[0].similarity;
        game["hltbName"] = hltbData[0].name;
    }
    jsonCache.saveCache(cache)
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


