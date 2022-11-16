const fs = require("fs/promises");

exports.selectApi = () => {
  return fs.readFile("endpoints.json").then((res) => {
    return JSON.parse(res);
  });
};
