#[macro_use]
extern crate failure;

extern crate rayon;
extern crate reqwest;

use failure::{Error, ResultExt};
use rayon::prelude::*;
use reqwest::{Client, header};
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;

pub type Result<T> = ::std::result::Result<T, Error>;
const THUMBNAIL_FILE: &str = "thumbnail-gifs.txt";

fn get_urls(file: &str) -> Result<Vec<String>> {
    let urls = File::open(file)
        .context(format_err!("Error opening {}", file))?;
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
        headers.insert(header::USER_AGENT, header::HeaderValue::from_static("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0"));
    let client = Client::builder()
        .default_headers(headers)
        .build()?;
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
    println!("Hello, world!");
    let images = get_urls(THUMBNAIL_FILE)?;
    let items: Vec<_> = images
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
    let mut output = File::create(THUMBNAIL_FILE)?;
    for item in items {
        writeln!(output, "{}", item)?;
    }

    Ok(())
}
