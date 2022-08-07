# HLTB
Grab the hours required to beat a list of games.

## Node Script
This script uses the [HLTB wrapper from ckatzorke](https://github.com/ckatzorke/howlongtobeat).

### Instructions for use
Setup a google sheet with 3 columns: Game Name, Current Hours, & Platform, and populate each 
row with the games you want to process.
![picture of the sheet](images/game-sheet.png)

Now `ctrl + shift` from the very cell to the bottom right corner of data,
and `ctrl + v` that data into a file at the same level as the loadGames.js script called `games.csv`. 
This is the file that will be loaded into the node script. Double check that each row item is separated by tabs.

Run `npm i` to install the dependencies. Then, you can run `node loadGames.js`

## Python HTML parser

Initially I wanted to scrape HLTB to retrieve the data from there directly for my list of games.
My language of choice for this was python, for the useful request_html session (for delayed renders) &
for the powerful beautiful soup library for html parsing. Alas, I was defeated by HLTB's weird routing and 
non-deterministic links.

To use the parser, you need to search your steam username in the HLTB website. This will 
return a page with a list of your steam games, current playtime, and time to beat. Right click to save this html page.
Save this page as `collectionSearch.html` in a folder called html adjacent to the hltb-scrape.py script.

This script should then be runnable. It will produce an output csv file that you can import into a google sheet or excel
where you can perform operations on it.

Limitations: this doesn't include the normal HLTB metrics of Main, Main + Extra, Completionist. This also doesn't grab 
non-steam games. It also won't work if you don't have your steam profile set to public.