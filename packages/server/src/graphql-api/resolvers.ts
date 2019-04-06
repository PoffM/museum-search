import { IResolvers } from "graphql-tools";
import { mapObject } from "./resolvers/mapObject";
import { museumMapObjects } from "./resolvers/museumMapObjects";
import { museums } from "./resolvers/museums";
import { IResolverContext } from "./types";

export const resolvers: IResolvers<{}, IResolverContext> = {
  MapObject: {
    __resolveType(obj: any) {
      if (obj.id) {
        return "Museum";
      } else {
        return "GeoPointBucket";
      }
    }
  },
  MuseumMapObjectEdge: {
    __resolveType(obj: any) {
      if (obj.node.geoHashKey) {
        return "GeoPointBucketEdge";
      } else {
        return "MuseumSearchEdge";
      }
    }
  },
  Query: {
    mapObject,
    museumMapObjects,
    museums
  }
};
