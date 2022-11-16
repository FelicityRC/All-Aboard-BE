const db = require("../database/connection");

exports.selectGroups = () => {
  return db.query(`SELECT * FROM groups`).then(({ rows: groups }) => {
    return groups;
  });
};
