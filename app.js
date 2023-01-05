const Fastify = require("fastify");
const mercurius = require("mercurius");
const usersJSON = require("./users.json");

const app = Fastify();

const schema = `
  type Query {
    users: [User]
  }
  type User {
    id: Int!
    title: String!
    body: String!
  }
`;

const resolvers = {
  Query: {
    users: async () => usersJSON,
  },
};

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

/* app.get("/", async function (req, reply) {
  const query = "query {users {id title}}";
  return reply.graphql(query);
}); */

const start = async () => {
  const port = 3000
  try {
    await app.listen({ port });
    console.log(`http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
