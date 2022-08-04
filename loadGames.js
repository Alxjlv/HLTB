let hltb = require('howlongtobeat');
let hltbService = new hltb.HowLongToBeatService();

// will need to debounce the requests so that I don't get banned for DDoSing lol
hltbService.search("Guardians of the Galaxy").then(result => console.log(result));