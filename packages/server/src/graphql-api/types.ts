import { Client } from "elasticsearch";
import { MapTileLoader } from "./resolvers/mapTile";

export interface IResolverContext {
  esClient: Client;
  mapTileLoader: MapTileLoader;
}
