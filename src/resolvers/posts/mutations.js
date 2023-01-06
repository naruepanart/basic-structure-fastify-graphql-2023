const client = require("../../../database/mongodb");
const mongodb = require("mongodb");

const postsMutations = {
  createPosts: async (_, args) => {
    const { input } = args;
    const { users } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const dto = { ...input, users: mongodb.ObjectId(users) };
    const result = await postsCollection.insertOne(dto);
    if (result.insertedId) {
      return "Successfully inserted";
    }
    return;
  },
  updatePosts: async (_, args) => {
    const { input } = args;
    const { _id, title, body, users } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const filter = { _id: mongodb.ObjectId(_id), users: mongodb.ObjectId(users) };
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        title,
        body,
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
    const { _id, users } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const filter = { _id: mongodb.ObjectId(_id), users: mongodb.ObjectId(users) };
    const result = await postsCollection.deleteOne(filter);
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
