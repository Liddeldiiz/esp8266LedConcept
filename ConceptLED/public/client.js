console.log('Client-side code running');

const buttonOn = document.getElementById('turnOn');
const buttonOff = document.getElementById('turnOff');

buttonOn.addEventListener('click', function(e) {
  console.log('turn on');

  // /turnOn is identified by the formaction tag in index.html
  fetch('/turnOn', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Turn on of LED was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

buttonOff.addEventListener('click', function(e) {
  console.log('turn off');

  // /turnOff is identified by the formaction tag in index.html
  fetch('/turnOff', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Turn off of LED was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

