const { MongoClient, ObjectId } = require("mongodb");
const users_services = require("./users_services");
const { z } = require("zod");

const MONGODB_CONNECT =
  "mongodb+srv://JtCqGymTW0vlPTIQ:urajvwgRuh89HUOq@cluster0.vnqxc.mongodb.net/abc?retryWrites=true&w=majority";

const client = new MongoClient(MONGODB_CONNECT);

const find = async (input) => {
  const schema = z.object({
    limit: z.number().max(10).default(10),
    skip: z.number().default(0),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const postsCollection = database.collection("posts");

  const result = await postsCollection.find({}).sort({ _id: -1 }).limit(dto.limit).skip(dto.skip).toArray();
  return result;
};
const findOne = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const postsCollection = database.collection("posts");

  const result = await postsCollection.findOne({ _id: new ObjectId(dto.id) });
  if (!result) {
    return { status_code: 1, message: "posts not found" };
  }
  return result;
};
const create = async (input) => {
  const schema = z.object({
    users: z.string(),
    title: z.string().trim(),
    body: z.string().trim(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const postsCollection = database.collection("posts");

  const usersServices = await users_services.findOne({ id: dto.users });
  if (usersServices.status_code === 1) {
    return { status_code: usersServices.status_code, message: usersServices.message };
  }

  const str = { ...dto, users: usersServices._id };
  const result = await postsCollection.insertOne(str);
  if (!result.insertedId) {
    return { status_code: 1, message: "create failure" };
  }
  return result;
};
const update = async (input) => {
  const schema = z.object({
    id: z.string(),
    users: z.string(),
    title: z.string().trim(),
    body: z.string().trim(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const postsCollection = database.collection("posts");

  const usersServices = await users_services.findOne({ id: dto.users });
  if (usersServices.status_code === 1) {
    return { status_code: usersServices.status_code, message: usersServices.message };
  }

  const filter = { _id: new ObjectId(dto.id), users: usersServices._id };
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      title: dto.title,
      body: dto.body,
    },
  };
  const result = await postsCollection.updateOne(filter, updateDoc, options);
  if (result.matchedCount === 0) {
    return { status_code: 1, message: "update failure" };
  }
  return result;
};
const remove = async (input) => {
  const schema = z.object({
    id: z.string(),
    users: z.string(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const postsCollection = database.collection("posts");

  const usersServices = await users_services.findOne({ id: dto.users });
  if (usersServices.status_code === 1) {
    return { status_code: usersServices.status_code, message: usersServices.message };
  }

  const filter = { _id: new ObjectId(dto.id), users: usersServices._id };
  const result = await postsCollection.deleteOne(filter);
  if (result.deletedCount === 0) {
    return { status_code: 1, message: "remove failure" };
  }
  return result;
};

module.exports = { find, findOne, create, update, remove };

/* const find = (body) => {
  return posts_services.find(body);
};
const findOne = (body) => {
  return posts_services.findOne(body);
};
const create = (body) => {
  return posts_services.create(body);
};
const update = (body) => {
  return posts_services.update(body);
};
const remove = (body) => {
  return posts_services.remove(body);
}; */

/* async function run() {
  try {
    const Tfind = await find({ limit: 5, skip: 0 });
    const TfindOne = await findOne({ id: "63b83523a13221c9026be01b" });
    const Tcreate = await create({ users: "63b84149a60f0c71577aa95b", title: Math.random(), body: Math.random() });
    const Tupdate = await update({
      id: "63b83523a13221c9026be01b",
      title: "updated 10",
      body: "updated 20",
      users: "63b84149a60f0c71577aa95b",
    });
    const Tremove = await remove({
      id: "63b8397e555dc782c8850094",
      users: "63b84149a60f0c71577aa95b",
    });
    console.log(Tremove);
  } finally {
    await client.close();
  }
}
run(); */
