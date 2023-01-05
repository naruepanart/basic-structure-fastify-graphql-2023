const client = require("../../../database/mongodb");
const mongodb = require("mongodb");

const postsMutations = {
  createPosts: async (_, args) => {
    const { input } = args;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    /* Converting the string to ObjectId. */
    const users = mongodb.ObjectId(input.users);
    const str = { ...input, users };

    const result = await postsCollection.insertOne(str);
    if (result.insertedId) {
      return "Successfully inserted";
    }
    return;
  },
  updatePosts: async (_, args) => {
    const { input } = args;
    const { _id, title } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const filter = { _id: mongodb.ObjectId(_id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        title,
      },
    };
    const result = await postsCollection.updateOne(filter, updateDoc, options);
    if (result.matchedCount === 1) {
      return "Successfully updated";
    }
    return;
  },
  deletePosts: async (_, args) => {
    const { input } = args;
    const { _id } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const query = { _id: mongodb.ObjectId(_id) };
    const result = await postsCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      return "Successfully deleted";
    }
    return;
  },
};

module.exports = postsMutations;

/* const postsMutations = {
  createPosts: async (_, args) => {},
};

module.exports = postsMutations;  */
