const posts_services = require("./posts_services");

const postsMutations = {
  createPosts: async (_, args) => {
    const { input } = args;
    const { users, title, body, country } = input;

    const result = await posts_services.create({ users, title, body, country });
    if (result.status_code === 1) {
      return result.message;
    }
    return "Successfully inserted";
  },
  updatePosts: async (_, args) => {
    const { input } = args;
    const { _id, title, body, users } = input;

    const result = await posts_services.update({ _id, users, title, body });
    if (result.status_code === 1) {
      return result.message;
    }
    return "Successfully updated";
  },
  removePosts: async (_, args) => {
    const { input } = args;
    const { _id, users } = input;

    const result = await posts_services.remove({ _id, users });
    if (result.status_code === 1) {
      return result.message;
    }
    return "Successfully deleted";
  },
};

module.exports = postsMutations;

/* const postsMutations = {
  createPosts: async (_, args) => {},
};

module.exports = postsMutations;  */
