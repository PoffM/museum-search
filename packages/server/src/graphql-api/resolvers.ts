import { IResolvers } from "graphql-tools";
import { mapObject } from "./resolvers/mapObject";
import { museumMapObjects } from "./resolvers/museumMapObjects";
import { museums } from "./resolvers/museums";
import { ResolverContext } from "./types";

export const resolvers: IResolvers<{}, ResolverContext> = {
  Query: {
    mapObject,
    museums,
    museumMapObjects
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
  MapObject: {
    __resolveType(obj: any) {
      if (obj.id) {
        return "Museum";
      } else {
        return "GeoPointBucket";
      }
    }
  }
};
