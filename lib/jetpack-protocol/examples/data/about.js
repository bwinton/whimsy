try {
  var req = new XMLHttpRequest();
  req.open('GET', 'about.md', true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
       if (req.status === 200 || req.status === 0) alert(req.responseText);
       else alert("Error loading page");
    }
  };
  req.send(null);
  alert("hold on a sec!");
} catch(e) {
  alert(e.message)
  throw e
}

