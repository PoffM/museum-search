import * as DataLoader from "dataloader";
import { Client, SearchResponse } from "elasticsearch";
import { IFieldResolver } from "graphql-tools";
import { decode_bbox } from "ngeohash";
import { IResolverContext } from "../types";

interface IMapTileLoaderParams {
  esClient: Client;
}

interface IMapTileLoaderKey {
  geohash: string;
  query?: string;
}

export type MapTileLoader = DataLoader<IMapTileLoaderKey, any>;

export const mapTile: IFieldResolver<{}, IResolverContext> = async (
  _,
  { geohash },
  { mapTileLoader }
) => {
  return mapTileLoader.load({ geohash });
};

export function getMapTileLoader({
  esClient
}: IMapTileLoaderParams): MapTileLoader {
  return new DataLoader<IMapTileLoaderKey, any>(async keys => {
    const body = [];

    const SEARCH_META = { index: "museums", size: 0 };
    for (const key of keys) {
      body.push(SEARCH_META);

      const { geohash, query } = key;

      const search = {
        aggs: {
          grid: {
            geohash_grid: {
              field: "location",
              precision: geohash.length
            }
          }
        },
        query: {
          bool: {
            filter: {
              geo_bounding_box: {
                location: getEsBoundingBox(geohash)
              }
            }
          }
        },
        size: 0
      };
      body.push(search);
    }

    // Cast to SearchResponse<{}>[] because "responses" shouldn't be undefined.
    const responses = (await esClient.msearch({ body }))
      .responses as SearchResponse<{}>[];

    return responses.map(response => {
      const bucket = response.aggregations.grid.buckets[0] || {};
      return { count: bucket.doc_count };
    });
  });
}

/**
 * Converts a geohash string to the bounding box format used by Elasticsearch filters.
 */
function getEsBoundingBox(geoHash: string) {
  const [bottom, left, top, right] = decode_bbox(geoHash);
  return {
    top_left: {
      lat: top,
      lon: left
    },
    bottom_right: {
      lat: bottom,
      lon: right
    }
  };
}
