#[macro_use]
extern crate failure;

extern crate rayon;
extern crate reqwest;

use failure::{Error, ResultExt};
use rayon::prelude::*;
use reqwest::{header, Client};
use std::collections::HashSet;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::iter::FromIterator;

pub type Result<T> = ::std::result::Result<T, Error>;
const THUMBNAIL_FILE: &str = "thumbnail-gifs.txt";
const USER_AGENT: &str =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0";

fn get_catgifs() -> Result<HashSet<String>> {
    let mut headers = header::HeaderMap::new();
    headers.insert(
        header::USER_AGENT,
        header::HeaderValue::from_static(USER_AGENT),
    );
    let client = Client::builder().default_headers(headers).build()?;
    let response = client
        .get("https://chilloutandwatchsomecatgifs.github.io/catgifs.txt")
        .send()?
        .text()?;
    Ok(response
        .lines()
        .filter(|url| !url.starts_with('#') && !url.trim().is_empty())
        .map(|url| url.to_owned())
        .collect())
}

fn get_urls(file: &str) -> Result<Vec<String>> {
    let urls = File::open(file).context(format_err!("Error opening {}", file))?;
    let mut buf_reader = BufReader::new(urls);
    let mut contents = String::new();
    buf_reader
        .read_to_string(&mut contents)
        .context(format_err!("Error reading {}", file))?;
    Ok(contents.lines().map(ToOwned::to_owned).collect())
}

fn get_item(url: &str) -> Result<String> {
    // Get the html and build an Item.
    let mut headers = header::HeaderMap::new();
    headers.insert(
        header::USER_AGENT,
        header::HeaderValue::from_static(USER_AGENT),
    );
    let client = Client::builder().default_headers(headers).build()?;
    let response = client.head(url).send()?;

    if response.status().is_success() {
        if response.url().as_str() != "http://i.imgur.com/removed.png" {
            Ok(response.url().clone().into_string())
        } else {
            Err(format_err!("{}:\n  Removed by imgur.", url))
        }
    } else {
        Err(format_err!("{}:\n  {}", url, &response.status()))
    }
}

fn main() -> Result<()> {
    let images = get_urls(THUMBNAIL_FILE)?;
    // Also check for duplicate images here somehow?
    let items: Vec<_> = images
        .clone()
        .par_iter()
        .map(|url| {
            if url.starts_with('#') || url.trim().is_empty() {
                Some(url.clone())
            } else {
                match get_item(url) {
                    Ok(item) => Some(item),
                    Err(ref e) => {
                        println!("Error {}", e);
                        None
                    }
                }
            }
        })
        .filter_map(|x| x)
        .collect();

    println!("images: {}", images.len());
    let mut all_urls: HashSet<String> = HashSet::from_iter(images);
    println!("all_urls A: {}", all_urls.len());
    all_urls.extend(items.clone());
    println!("all_urls B: {}", all_urls.len());
    let catgifs = get_catgifs()?;
    println!("\ncatgifs A: {:?}", catgifs.len());
    let missing: HashSet<String> = catgifs
        .difference(&all_urls)
        .map(|url| get_item(url).ok())
        .filter_map(|x| x)
        .collect();

    let actually_missing: HashSet<&String> = missing
        .difference(&all_urls).collect();

    println!("catgifs B: {:?}", actually_missing.len());
    let mut output = File::create(THUMBNAIL_FILE)?;
    for item in items {
            writeln!(output, "{}", item)?;
    }
    if !actually_missing.is_empty() {
        for item in actually_missing {
            writeln!(output, "{}", item)?;
        }
    }

    Ok(())
}
