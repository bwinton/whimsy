# History

## 0.3.0 / 2012-04-11

  - Stop parsing URLs in `CustomURI` constructor and let `onResolve` handler
    do the job instead to avoid error prone guesses.

## 0.2.0 / 2011-07-07

  - Custom URIs implement `nsIStandardURL` have been added to fix security
    issues that were breaking `XHR` request and `history.pushState` from
    non-standard URIs like `edit:`.
  - Support for asynchronous request handling. Issue #3
  - API redesign exposing diff handlers for URI resolution and content request 
    Issue #4

## 0.1.0 / 2011-06-16

  - Bug Fix.
  - Package layout restructuring.

## 0.0.3 / 2011-03-04

  - Adding optional `originalURI` property on response to inherit privileges
    from it if necessary.
  - Make API more explicit about redirects and content writes.

## 0.0.2 / 2011-01-10

  - Removing hack with system principles.
  - Add `originalURI` to all channels.

## 0.0.1 / 2010-12-31

  - Initial release.
