#!/usr/bin/env python
import requests

HEADER = '\033[95m'
OKBLUE = '\033[94m'
OKGREEN = '\033[92m'
WARNING = '\033[93m'
FAIL = '\033[91m'
ENDC = '\033[0m'

headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0'
}

def main():
    r = requests.get('http://chilloutandwatchsomecatgifs.com/catgifs.txt')
    catgifs = set()
    for row in r.iter_lines():
        link = row.strip()
        if link and not link.startswith('#'):
            catgifs.add(link)
    for thumb in thumbnail_list('thumbnail-gifs.txt'):
        cat = False
        if thumb in catgifs:
            cat = True
            catgifs.remove(thumb)
        try:
            r = requests.head(thumb, headers=headers)
        except Exception as e:
            print thumb, str(e)
            if cat:
              print FAIL + '  catgif.' + ENDC
            continue
        if r.status_code in [301, 302]:
            print thumb, FAIL + str(r.status_code)
            if r.headers['location'] != 'http://i.imgur.com/removed.png':
                print '  ' + HEADER + r.headers['location'] + ENDC,
            else:
                print '  ' + HEADER + 'removed by imgur.' + ENDC
            if cat:
              print FAIL + '  catgif.' + ENDC
        elif r.status_code != 200:
            print thumb, FAIL + str(r.status_code) + ENDC
            if cat:
                print FAIL + '  catgif.' + ENDC
    if len(catgifs):
        print '\n' + FAIL + 'Missing Catgifs!' + ENDC
        for thumb in catgifs:
            print thumb


def thumbnail_list(name = None):
    if name is None:
        raise Exception('Thumbnail file not defined')
    with open(name) as f:
        for row in f.read().splitlines():
            link = row.strip()
            if link and not link.startswith('#'):
                yield link


if __name__ == '__main__':
    main()
