const client = require("../../../database/mongodb");
const mongodb = require("mongodb");

const usersMutations = {
  createUsers: async (_, args) => {
    const { input } = args;

    const database = client.db("abc");
    const usersCollection = database.collection("users");

    const result = await usersCollection.insertOne(input);
    if (result.insertedId) {
      return "Successfully inserted";
    }
    return;
  },
  updateUsers: async (_, args) => {
    const { input } = args;
    const { _id, name } = input;

    const database = client.db("abc");
    const usersCollection = database.collection("users");

    const filter = { _id: mongodb.ObjectId(_id) };
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        name,
      },
    };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    if (result.matchedCount === 1) {
      return "Successfully updated";
    }
    return;
  },
  deleteUsers: async (_, args) => {
    const { input } = args;
    const { _id } = input;

    const database = client.db("abc");
    const usersCollection = database.collection("users");

    const filter = { _id: mongodb.ObjectId(_id) };
    const result = await usersCollection.deleteOne(filter);
    if (result.deletedCount === 1) {
      return "Successfully deleted";
    }
    return;
  },
};

module.exports = usersMutations;

/* const usersMutations = {
  createUsers: async (_, args) => {},
};

module.exports = usersMutations;  */
