function validateTaskOptions(name, interval, task) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("task name  needed");
  }

  if (typeof interval !== "number" || interval <= 0) {
    throw new Error("task interval needs to be bigger than 0");
  }

  if (typeof task !== "function") {
    throw new Error("task callback needs to be a function");
  }
}

module.exports = validateTaskOptions;