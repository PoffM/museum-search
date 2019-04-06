import { ApolloServer } from "apollo-server";
import { Client } from "elasticsearch";
import { resolvers } from "./resolvers";
import { getMapTileLoader } from "./resolvers/mapTile";
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
        mapTileLoader: getMapTileLoader({ esClient })
      } as IResolverContext),
    resolvers,
    typeDefs
  });
}
