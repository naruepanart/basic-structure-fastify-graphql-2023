const { MongoClient, ObjectId } = require("mongodb");
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
  const usersCollection = database.collection("users");

  const result = await usersCollection.find({}).sort({ _id: -1 }).limit(dto.limit).skip(dto.skip).toArray();
  return result;
};
const findOne = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const usersCollection = database.collection("users");

  const result = await usersCollection.findOne({ _id: new ObjectId(dto.id) });
  if (!result) {
    return { status_code: 1, message: "users not found" };
  }
  return result;
};
const create = async (input) => {
  const schema = z.object({
    name: z.string().trim(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const usersCollection = database.collection("users");

  const result = await usersCollection.insertOne(dto);
  if (!result.insertedId) {
    return { status_code: 1, message: "create failure" };
  }
  return result;
};
const update = async (input) => {
  const schema = z.object({
    id: z.string(),
    name: z.string(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const usersCollection = database.collection("users");

  const filter = { _id: new ObjectId(dto.id) };
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      name: dto.name,
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  if (result.matchedCount === 0) {
    return { status_code: 1, message: "update failure" };
  }
  return result;
};
const remove = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  const dto = schema.parse(input);

  const database = client.db("abc");
  const usersCollection = database.collection("users");

  const filter = { _id: new ObjectId(dto.id) };
  const result = await usersCollection.deleteOne(filter);
  if (result.deletedCount === 0) {
    return { status_code: 1, message: "remove failure" };
  }
  return result;
};

module.exports = { find, findOne, create, update, remove };

/* const find = (body) => {
  return users_services.find(body);
};
const findOne = (body) => {
  return users_services.findOne(body);
};
const create = (body) => {
  return users_services.create(body);
};
const update = (body) => {
  return users_services.update(body);
};
const remove = (body) => {
  return users_services.remove(body);
}; */

/* async function run() {
  try {
    const Tfind = await find({ limit: 5, skip: 0 });
    const TfindOne = await findOne({ id: "63b70c7b5a644d109bba1d92" });
    const Tcreate = await create({ name: Math.random() });
    const Tupdate = await update({
      id: "63b8414e0276c377c1c7df1c",
      name: "Alessia Rosario",
    });
    const Tremove = await remove({
      id: "63b84149a60f0c71577aa95b",
    });
    console.log(Tremove);
  } finally {
    await client.close();
  }
}
run(); */
