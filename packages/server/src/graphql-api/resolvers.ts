import { IResolvers } from "graphql-tools";
import { mapTile } from "./resolvers/mapTile";
import { museumMapObjects } from "./resolvers/museumMapObjects";
import { museums } from "./resolvers/museums";
import { IResolverContext } from "./types";

export const resolvers: IResolvers<{}, IResolverContext> = {
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
    mapTile,
    museumMapObjects,
    museums
  }
};
