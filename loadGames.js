let hltb = require('howlongtobeat');
const createCache = require("./jsonCache");
let hltbService = new hltb.HowLongToBeatService();

createCache(false)
// will need to debounce the requests so that I don't get banned for DDoSing lol
hltbService.search("Guardians of the Galaxy").then(result => console.log(result));