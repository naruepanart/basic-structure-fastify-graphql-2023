const client = require("../../../database/mongodb");
const mongodb = require("mongodb");

const postsQuery = {
  findPosts: async (_, args) => {
    const { input } = args;
    const { page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;
    if (limit > 10) {
      return { status_code: 1, message: `limit ${limit}` };
    }

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const result = await postsCollection
      .aggregate()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lookup({
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      })
      .unwind("$users")
      .toArray();
    return result;
  },
  findOnePosts: async (_, args) => {
    const { input } = args;
    const { _id } = input;

    const database = client.db("abc");
    const postsCollection = database.collection("posts");

    const result = await postsCollection
      .aggregate()
      .match({ _id: mongodb.ObjectId(_id) })
      .lookup({
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      })
      .unwind("$users")
      .toArray();

    return result[0];
  },
};

module.exports = postsQuery;
