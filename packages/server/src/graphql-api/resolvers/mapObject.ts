import { ResolverContext } from "../types";
import { IFieldResolver } from "graphql-tools";

export const mapObject: IFieldResolver<{}, ResolverContext> = async (
  _,
  { geohash },
  { mapObjectLoader }
) => {
  return mapObjectLoader.load({ geohash });
};
