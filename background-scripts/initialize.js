var placeholders = [];
function initialize(url, callback){
  fetch(url).then(function(response){
    if(response.ok){
      response.text().then(function(data){
        placeholders = data;
        placeholders = placeholders.split('\n');
        placeholders = placeholders.map(function(x){
          return x.trim();
        }).filter(function(x){
          return !x.startsWith('#') && (x !== '');
        })
        callback(placeholders);
      })
    } else {
      throw new Error('Network response was not ok.');
    }
  }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
}
