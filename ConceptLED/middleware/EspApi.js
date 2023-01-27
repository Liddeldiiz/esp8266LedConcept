const { Worker } = require('worker_threads');

const ledSwitchStateRequest = (state, res) => {
  const worker = new Worker("../workers/worker-switch-state.js", {
    workerData: state
  });
  worker.on('message', (data) => {
    res.status(200);
    console.log(`Request to switch state was ${data}`);
  });
  worker.on('error', (msg) => {
    res.status(404);
    console.log(`The error in worker-switch-state.js: ${msg}`);
  });
}
  
const ledStatusRequest = (res) => {
  const worker = new Worker("../workers/worker-check-node-status.js", {

  });
  worker.on('message', (data) => {
      res.status(200);
      console.log(data);
  });
  worker.on('error', (msg) => {
      res.status(404);
      console.log(`The error in worker-check-node-status.js: ${msg}`);
  });
}


module.exports = {
  ledSwitchStateRequest,
  ledStatusRequest
};