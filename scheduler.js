console.log("scheduler.js started");

function scheduleTask(name, interval, task) {
  setInterval(task, interval);
}

scheduleTask("running task", 10000, () => {
  console.log("running");
});

module.exports = scheduleTask;