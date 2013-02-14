Micropilot
==============

Record user events directly in your Firefox addon with a one-file event observation, recording, and upload module.

Data operations are asynchronous, and use [promise-style apis](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/promise.html).

Examples
----------

```
// record {a:1, ts: <now>}.  Then upload.
require('micropilot').Micropilot('simplestudyid').start().
   record({a:1,ts: Date.now()}).then(function(m) m.ezupload())
   // which actually uploads!
```

```
// for 1 day, record any data notified on Observer topics ['topic1', 'topic2']
// then upload to <url>, after that 24 hour Fuse completes
require("micropilot").Micropilot('otherstudyid').start().watch(['topic1','topic2']).
  lifetime(24 * 60 * 60 * 1000 /*1 day Fuse */).then(
    function(mtp){ mtp.upload(url); mtp.stop() })
```

```
let monitor_tabopen = require('micropilot').Micropilot('tapopenstudy').start();
var tabs = require('tabs');
tabs.on('ready', function () {
  monitor_tabopen.record({'msg:' 'tab ready', 'ts': Date.now()})
});

monitor_tabopen.lifetime(86400*1000).then(function(mon){mon.ezupload()});
  // Fuse:  24 hours-ish after first start, upload

if (user_tells_us_to_stop_snooping){
  monitor_tabopen.stop();
}
```


Overview
---------------

1. Create monitor (creates IndexedDb collections to store records)
2. Record JSON-able data
   * directly, by calling `record()`, if the monitor is in scope.
   * indirectly, by
     - monitoring `observer-service` topics
     - `require("observer-service").notify(topic,data)`
3. Upload recorded data, to POST url of your choosing, including user metadata.
4. Clean up (or don't!)



Api
----

http://gregglind.github.com/micropilot/

Coverage and Tests
----------------------

* method: https://gist.github.com/3900355
* result: http://gregglind.github.com/micropilot/coverreport.html

Longer, Annotated Example, Demoing Api
-----------------------------------------

```
  let monitor = require("micropilot").Micropilot('tabsmonitor');
  /* Effects:
    * Create IndexedDb:  youraddonid:micropilot-tabsmonitor
    * Create objectStore: tabsmonitor
    * Using `simple-store` persist the startdate of `tabsmonitor`
      as now.
    *
  */
  monitor.record({c:1}).then(function(d){
    assert.deepEqual(d,{"id":1,"data":{"c":1}} ) })
  /* in db => {"c"1, "eventstoreid":1} <- added "eventstoreid" key */
  /* direct record call.  Simplest API. */

  monitor.data().then(function(data){assert.ok(data.length==1)})
  /* `data()` promises this data:  [{"c":1, "eventstoreid":1}] */

  monitor.clear().then(function(){assert.pass("async, clear the data and db")})

  // *Observe using topic channels*

  monitor.watch(['topic1','topic2'])
  /* Any observer-service.notify events in 'topic1', 'topic2' will be
     recorded in the IndexedDb */

  monitor.watch(['topic3']) /* add topic3 as well */

  monitor.unwatch(['topic3']) /* changed our mind. */

  observer.notify('kitten',{ts: Date.now(), a:1}) // not recorded, wrong topic

  observer.notify('topic1',{ts: Date.now(), b:1}) // will be recorded, good topic

  monitor.data().then(function(data){/* console.log(JSON.stringify(data))*/ })
  /* [{"ts": somets, "b":1}] */

  monitor.stop().record({stopped:true})  // won't record

  monitor.data().then(function(data){
    assert.ok(data.length==1);
    assert.ok(data[0]['b'] == 1);
  })

  monitor.willrecord = true;  // turns recording back on.

  // Longer runs
  let microsecondstorun = 86400 * 1000 // 1 day!
  monitor.lifetime(microsecondstorun).then(function(mtp){
    console.log("Promises a Fuse that will be");
    console.log("called no earlier 24 hours after mtp.startdate.");
    console.log("Even / especially surviving Firefox restarts.");
    console.log("`lifetime` or `stop` stops any previous fuses.");
    mtp.stop(); /* stop this study from recording*/
    mtp.upload(UPLOAD_URL).then(function(response){
      if (response.status != 200){
        console.error("what a bummer.")
      }
    })
  });

  monitor.stop();  // stop the Fuse!
  monitor.lifetime();   // no argument -> forever.  Returned promise will never resolve.

  // see what will be sent.
  monitor.upload('http://fake.com',{simulate: true}).then(function(request){
    /*
    console.log(JSON.stringify(request.content));

    {"events":[{"ts":1356989653822,"b":1,"eventstoreid":1}],
    "userdata":{"appname":"Firefox",
      "location":"en-US",
      "fxVersion":"17.0.1",
      "updateChannel":"release",
      "addons":[]},
    "ts":1356989656951,
    "uploadid":"5d772ebd-1086-ea46-8439-0979217d29f7",
    "personid":"57eef97d-c14b-6840-b966-b01e1f6eb04c"}
    */
  })

  /* we have overrides for some pieces if we need them...*/
  monitor._config.personid /* store/modify the person uuid between runs */
  monitor.startdate /* setting this stops the Fuse, to allow 're-timing' */
  monitor.upload('fake.com',{simulate:true, uploadid: 1}); /* give an uploadid */

  monitor.stop();
  assert.pass();
```

Supported Versions
----------------------

Desktop Firefox 17+ is supported.  (16's IndexedDB is too different).  If you need Firefox 17 support, remember to copy `lib/indexed-db-17.js`.  18+ doesn't require this.

Mobile Firefox 21+ is known to work.  Other versions are untested, but probably safe.

Checking this is your responsibility.

```
  if (require('sdk/system/xul-app').version < 17){
    require("request").Request("personalized/phone/home/url").get()
  }
```


FAQ
-----

What are events?

* any jsonable (as claimed by `JSON.stringify`) object.

What is a topic?

* just a string defining the 'message name' or 'message type'.
* (convention comes from the [observer-service]https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/deprecated/observer-service.html)
* you decide these for your own convenience.

Why so much emphasis on the `observer-service`?

* global message passing mechanism that crosses sandboxes (allows inter-addon communication)
* robust and well-tested
* many 'interesting' events are already being logged there.
* (remember, you can `record` directly, if the monitor is in scope!)

Timestamps on events?

* you need to timestamp your own events!


Run indefinitely / forever

   `micropilot('yourid').lifetime()  // will never resolve.`
   `micropilot('yourid').start()  // will never resolve.`


Wait before running / delay startup (for this restart)?

* do it yourself... using `setTimeout` or `Fuse` like:

```
	Fuse({start: Date.now(),duration:1000 /* 1 sec */}).then(
	 function(){Micropilot('mystudy').start()} )
```

Wait before running / delay startup (over restarts)?

* do it yourself... using `setTimeout` or `Fuse` like:

```
  let {storage} = require("simple-storage");
  if (! storage.firststart) storage.firststart = Date.now(); // tied to addon
  Fuse({start: storage.firststart,duration:86400 * 7 * 1000 /* 7 days */}).then(
   function(){ Micropilot('delayedstudy').start()} )
```

Stop recording (messages arrive but aren't recorded)

- `yourstudy.stop()`
- `yourstudy.willrecord = false`


Respect user privacy and private mode

- Given the changes in `require("private-browsing")` at Firefox 20, this is really up to study authors to track themselves.  Ask @gregglind if you need help.
- Be extra wary of `globalObserver` notifications, which might come from private windows.
- Changes at Firefox 20:

  * global `isActive` disappears
  * per-window private mode starts


Add more topics (channels), or remove them:

```
  yourstudy.watch(more_topics_list)
  yourstudy.unwatch(topics_list)
```

Remove all topics

  yourstudy.unwatch()

Just record some event without setting up a topic:

  `yourstudy.record(data)`

See all recording events in the console.

- `require('simpleprefs').prefs['logtoconsole'] = true`

Stop the callback in `lifetime(duration).then()`... (unlight the Fuse!)

  `yourstudy.stop();`

Why have a `studyid`?

* used as `IndexedDb` collection name.
* used for the 'start time' persistent storage key, to persist between runs.

Fusssing with internals:

* `id`:  don't change this

Do studies persist after Firefox shutdown / restart?

* Yes, in that the start time is recorded using `simple-storeage`, ensuring that the duration is 'total duration'.  In other words `lifetime(duration=many_ms)` will Do The Right Thing.
* Data persists between runs.

How do I clean up my mess?

```
  Micropilot('studyname').lifetime(duration).then(function(mtp){
    mtp.stop();
    mtp.upload(somewhere);
    mtp.cleardata();    // collection name might still exist
    require('simple-storage').store.micropilot = undefined
    let addonid = require('self').id;
    require("sdk/addon/installer").uninstall(addonid); // apoptosis of addon
  })
```

I don't want to actually record / I want to do something else on observation.

* `yourstudy._watchfn = function(subject){}` before any registration / start / lifetime.
* (note:  you can't just replace `record` because it's a `heritage` frozen object key)

How can I notify people on start / stop / comletion / upload?

* Write your own
* use Test Pilot 2, or similar.

How do uploads work?

* snoops some user data, and all recorded events
* to `url`.  returns promise on response.
* for now, it's up to you to check that response, url and otherwise check that you are happy with it.

```
  let micro = require('micropilot');
  let studyname = 'mystudy';
  micro.Micropilot(studyname).upload(micro.UPLOAD_URL + studyname).then(
    function(response){ /* check response, retry using Fuse, etc. */ })
```

My `startdate` is wrong

```
  // will stop the study run callback, if it exists
  mystudy.startdate = whenever  // setter
  mystudy.lifetime(newduration).then(callback)
```

Recurring upload of data?

```
  let {storage} = require("simple-storage");
  if (! storage.lastupload) storage.lastupload = Date.now(); // tied to addon
  let mtp = Micropilot('mystudy');  // running, able to record.

  Fuse({start: storage.lastupload,duration:86400 * 1000 /* 1 days */}).then(
    function(){
      storage.lastupload = Date.now();
      mtp.upload(URL).then(mtp.clear);  // if you really want clearing between!
    })
```

How well does it perform / scale?

* on mobile it has been measured to write 40 events/sec.
* on desktop (OSX) it has been measured at 120-240 events/sec.
* Plan for 10, and you will probably be happier.

Use With Existing Test Pilot 1?

* create a Test Pilot experiment jar that loads your addon (using `study_base_classes`).
* make the addon self destructing, using a Fuse and `addonManager`.
* (the study here will track its own data and uploads)
* Downsides
  - TP1 will lose control of being able to stop the study
  - much less transparent where the data is being stored.

```

  require('timers').setInterval()

```

Event Entry Order is Wrong / Some got lost

* Events are written asynchronously.  Order is not guaranteed.
* During catastrophic Firefox crash, some events may not be written.

I want to persist other aspects / attributes of the study across restarts

* `micropilot('mystudy')._config.YOURKEY // persists in addon`
* use `simple-storage` directly
* store things in prefs, using `simple-prefs` or `preferences-service`
* Make an IndexedDb or Sqlite db
* write a file to the profile

I Want a Pony

* Ponies are scheduled for Version 2.
* You can't have a pony, since this is JavaScript and not Python.


Glossary
-----------

* `topic`:
  - [Addon-sdk observer-service]https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/deprecated/observer-service.html
  - [nsIObserverService]https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIObserverService
  - [Partial List of Firefox Global Topics]https://developer.mozilla.org/en-US/docs/Observer_Notifications
* `observe` / `notify`:  Global `observerService` terms.
* `watch` / `unwatch`:  `Micropilot` listens to `observer` for `topics`
* `record`: attempt to write data to the `IndexedDb`
* `event`:  in Micropilot, any `JSON.stringify`-able object.  Used broadly for "a thing of human interest that happened", not in the strict JS sense.

Other Gory Details and Sharp Edges:
-------------------------------------

Study `lifetime(duration).then(callback)` is a `setTimout` based on `Date.now()`, `startdate` and the `duration`.  If you want a more sophisticated timing loop, use a `Fuse` or write your own.

Authors
----------

Gregg Lind <glind@mozilla.com>

License
----------

MPL2
