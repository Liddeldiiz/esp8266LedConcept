console.log('Client-side code running');

const buttonOn = document.getElementById('turnOn');
const buttonOff = document.getElementById('turnOff');
const buttonState = document.getElementById('status');
const button4Hours = document.getElementById('4hours');
const ctx = document.getElementById('myChart');

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

buttonState.addEventListener('click', function(e) {
  console.log('status');


  // /turnOff is identified by the formaction tag in index.html
  fetch('/status', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log(response);// how can I get the status of the LED from the server as a response?
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
  });

button4Hours.addEventListener('click', function(e) { // how to transform data from db into graphs and how to pass it from server.js to here?
  console.log('Get data for last 4 hours');

  fetch('/fourHours', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log(response);
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
