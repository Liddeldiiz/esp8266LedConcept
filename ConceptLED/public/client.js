console.log('Client-side code running');

const buttonOn = document.getElementById('turnOn');
const buttonOff = document.getElementById('turnOff');

buttonOn.addEventListener('click', function(e) {
  console.log('turn on');

  fetch('/LED', {method: 'POST'})
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
  fetch('/LED', {method: 'POST'})
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

