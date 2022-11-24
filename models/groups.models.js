const db = require("../database/connection");

exports.selectGroups = () => {
  return db.query(`
  SELECT groups.*, 
    JSON_AGG(
        DISTINCT jsonb_build_object('user_id', users.user_id,
                                  'username', users.username,
                                  'organiser', userGroups.organiser)) AS users
      FROM groups
      LEFT JOIN userGroups ON groups.group_id = userGroups.group_id
      JOIN users ON userGroups.user_id = users.user_id
      GROUP BY groups.group_id
      ;
  `).then(({ rows: groups }) => {
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
    .query(
      `
      SELECT groups.*, 
      JSON_AGG(
          DISTINCT jsonb_build_object('user_id', users.user_id,
                                    'username', users.username,
                                    'organiser', userGroups.organiser)) AS users
        FROM groups
        LEFT JOIN userGroups ON groups.group_id = userGroups.group_id
        JOIN users ON userGroups.user_id = users.user_id
        WHERE groups.group_id = $1
        GROUP BY groups.group_id
        ;
    `,
      [group_id]
    )
    .then(({ rows: [group] }) => {
      if (group) {
        return group;
      } else {
        return Promise.reject({ status: 404, msg: "Group Not Found" });
      }
    });
};

exports.insertUserToUserGroups = (user_id, group_id) => {

  return db.query(
    `
    INSERT INTO userGroups (user_id, group_id, organiser) 
    SELECT $1, $2, false
    WHERE NOT EXISTS (SELECT user_id, group_id from userGroups WHERE user_id = $1 AND group_id = $2)
    RETURNING *;
    `, [user_id, group_id]
  ).then(({rows: [userGroup]}) => {
    if (!userGroup) {
      return Promise.reject({
        status: 400,
        msg: "User is already included",
      });
    } else {
      return userGroup;
    }
  })
}