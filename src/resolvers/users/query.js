const client = require("../../../database/mongodb");
const mongodb = require("mongodb");

const usersQuery = {
  findUsers: async (_, args) => {
    const { input } = args;
    const { page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;
    if (limit > 10) {
      return { status_code: 1, message: `limit ${limit}` };
    }

    const database = client.db("abc");
    const usersCollection = database.collection("users");

    const result = await usersCollection.find().sort({ _id: -1 }).limit(limit).skip(skip).toArray();
    return result;
  },
  findOneUsers: async (_, args) => {
    const { input } = args;
    const { _id } = input;

    const database = client.db("abc");
    const usersCollection = database.collection("users");

    const query = { _id: mongodb.ObjectId(_id) };
    const options = {
      sort: { _id: -1 },
    };
    const result = await usersCollection.findOne(query, options);
    return result;
  },
};

module.exports = usersQuery;
