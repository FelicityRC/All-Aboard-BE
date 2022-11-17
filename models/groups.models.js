const db = require("../database/connection");

exports.selectGroups = () => {
  return db.query(`SELECT * FROM groups`).then(({ rows: groups }) => {
    return groups;
  });
};
exports.selectGroupByGroupId = (group_id) => {
  // this checks the group_id is a positive integer
  const num = Number(group_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "group_id must be a positive integer",
    });
  }

  return db
    .query(`SELECT * FROM groups WHERE group_id=$1`, [group_id])
    .then(({ rows: [group] }) => {
      if (group) {
        return group;
      } else {
        return Promise.reject({ status: 404, msg: "Group Not Found" });
      }
    });
};

exports.selectUsersByGroupId = (group_id) => {
  // this checks the group_id is a positive integer
  const num = Number(group_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "group_id must be a positive integer",
    });
  }

  return db
    .query(`SELECT * FROM groups WHERE group_id=$1`, [group_id])
    .then(({ rows: [group] }) => {
      if (group) {
        let queryString = `SELECT * FROM users WHERE `;
        for (const user_id of group.users) {
          queryString += `user_id=${user_id} OR `;
        }
        queryString = queryString.slice(0, -3);
        return db.query(queryString).then(({ rows: users }) => {
          return users;
        });
      } else {
        return Promise.reject({ status: 404, msg: "Group Not Found" });
      }
    });
};
