import { Client } from "elasticsearch";
import { MapObjectLoader } from "./dataloaders/mapObjectLoader";

export interface IResolverContext {
  esClient: Client;
  mapObjectLoader: MapObjectLoader;
}
