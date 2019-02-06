import { Client } from "elasticsearch";
import { MapObjectLoader } from "./dataloaders/mapObjectLoader";

export interface ResolverContext {
  esClient: Client;
  mapObjectLoader: MapObjectLoader;
}
