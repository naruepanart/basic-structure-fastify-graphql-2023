const usersJSON = require("./users.json");

const userQuery = {
  users: async () => usersJSON,
  /*  authors: async (_, args) => {},
  author: async (_, args) => {}, */
};

module.exports = userQuery;
