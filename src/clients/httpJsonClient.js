const https = require("https");

function requestJson(url, options = {}) {
  const timeoutMs = options.timeoutMs || 5000;

  return new Promise((resolve, reject) => {
    const request = https.request(url, { method: "GET" }, (response) => {
      let data = "";

      response.setEncoding("utf8");

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        let body = null;

        try {
          body = data ? JSON.parse(data) : null;
        } catch (error) {
          reject(error);
          return;
        }

        resolve({
          statusCode: response.statusCode,
          body
        });
      });
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error("Request timeout"));
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.end();
  });
}

module.exports = {
  requestJson
};
