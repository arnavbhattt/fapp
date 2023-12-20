import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
//import { Post } from "./entities/Post";
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";



const main = async () => {
  // Connecting to database
  const orm = await MikroORM.init(microConfig);
  // Run migrations to current schema diff
  await orm.getMigrator().up();
  
  const app = express();
  
  const apolloServer = new ApolloServer({

    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost4000');
  });
  // Run SQL commands
  // const post = orm.em.create(Post, {
  //   title: 'my first post',
  //   createdAt: new Date(), // Set createdAt to the current date
  //   updatedAt: new Date(), // Set updatedAt to the current date
  // });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main();