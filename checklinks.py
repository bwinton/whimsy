#!/usr/bin/env python
import requests

def main():
    thumb_file = 'thumbnail-gifs.txt'
    for thumb in thumbnail_list(thumb_file):
        try:
            r = requests.head(thumb)
        except Exception as e:
            print thumb, str(e)
            continue
        if r.status_code != 200:
            print thumb, r.status_code


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
