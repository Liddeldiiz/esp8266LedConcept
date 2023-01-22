console.log('Client-side code running');

const buttonOn = document.getElementById('test');
var status = document.getElementById('status');

buttonOn.addEventListener('click', function(e) {
  console.log('test');

  // /turnOn is identified by the formaction tag in index.html
  fetch('/test', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Test button');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});
