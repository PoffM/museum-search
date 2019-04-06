import { ApolloServer } from "apollo-server";
import { Client } from "elasticsearch";
import { getMapObjectLoader } from "./dataloaders/mapObjectLoader";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import { IResolverContext } from "./types";

interface ICreateServerParams {
  esClient: Client;
}

export function createServer({ esClient }: ICreateServerParams) {
  return new ApolloServer({
    context: () =>
      ({
        esClient,
        mapObjectLoader: getMapObjectLoader({ esClient })
      } as IResolverContext),
    resolvers,
    typeDefs
  });
}
