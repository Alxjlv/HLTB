from typing import TextIO

from bs4 import BeautifulSoup
from requests_html import HTMLSession
import pickle
import requests
import collections
import sys

URL = "https://howlongtobeat.com/user?n=rrrjax&s=games&all=1"


def scrape_profile_list(url):
    session = HTMLSession()

    res = session.get(url)

    # profile list requires javascript loading of each accordion content
    res.html.render(sleep=5, keep_page=True)
    html_content = res.html.html.encode(sys.stdout.encoding, errors='replace')
    f = open("html/htmlPage.html", "wb")
    f.write(html_content)
    f.close()


def scrape_search(url):
    pass


def scrape_steam_list(url):
    file = open("html/collectionSearch.html", "r")
    return file


def parse_profile_list(html_file):
    html_file.close()


def parse_steam_list(html_file):
    soup = BeautifulSoup(html_file, 'html5lib')
    table_rows = soup.findAll('tbody', attrs={'class': 'spreadsheet'})
    print(f'{len(table_rows)} games processed')

    games = ['name=my_time=to_beat=tag']
    for tbody in table_rows:
        # red is used for multiplayer titles
        red_times = tbody.findAll('td', attrs={'class': 'center text_red'})
        if red_times:
            times = red_times
            tag = "|Multiplayer"
        else:
            times = tbody.findAll('td', attrs={'class': 'center'})
            tag = "None"

        # span is used for obsolete titles
        obs_name = tbody.find('span')
        if obs_name:
            name = obs_name
            tag += '|Obsolete/Tool'
        else:
            name = tbody.find('a')

        # using = as the column separator for CSV
        # times[1] and times[0] are in that order as the html is in order of completion time then my time
        item = \
            name.text + '=' + \
            times[1].text.strip() + '=' +\
            times[0].text.strip() + '=' +\
            tag
        games.append(item)
    file = open("output_list.csv", "w")
    for game in games:
        print(game)
        file.write(game + '\n')

    file.close()
    html_file.close()


def parse_search_result(html_file):
    html_file.close()


if __name__ == '__main__':
    parse_steam_list(scrape_steam_list(""))
