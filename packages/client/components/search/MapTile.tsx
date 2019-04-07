import gql from "graphql-tag";
import { divIcon, LatLngBoundsLiteral, LatLngTuple, point } from "leaflet";
import { decode_bbox } from "ngeohash";
import { graphql } from "react-apollo";
import { Marker, Rectangle } from "react-leaflet";
import "../../style/MuseumMap.css";

interface IMapTileProps {
  geohash: string;
  query?: string;
}

export const GET_MAP_TILE = gql`
  query mapTile($geohash: String!) {
    mapTile(geohash: $geohash) {
      count
    }
  }
`;

const withMapTile = graphql<IMapTileProps, any, IMapTileProps>(GET_MAP_TILE, {
  options: ({ geohash, query }) => ({ variables: { geohash, query } })
});

export const MapTile = withMapTile(
  ({ data: { loading, mapTile }, geohash }) => {
    const [south, west, north, east] = decode_bbox(geohash);
    const bounds: LatLngBoundsLiteral = [[south, west], [north, east]];
    const center: LatLngTuple = [(north + south) / 2, (west + east) / 2];

    if (loading) {
      const icon = divIcon({
        html: `
        <div style="width: 300px">
          <span>loading...</span>
        </div>
      `
      });

      return (
        <Rectangle bounds={bounds}>
          <Marker position={center} icon={icon} />
        </Rectangle>
      );
    }

    if (mapTile) {
      const { count } = mapTile;
      const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";

      const icon = divIcon({
        className: `marker-cluster marker-cluster-${size}`,
        html: `<div><span>${count}</span></div>`,
        iconSize: point(40, 40)
      });

      return (
        (loading || count) && (
          <Rectangle bounds={bounds}>
            <Marker position={center} icon={icon} />
          </Rectangle>
        )
      );
    }
  }
);
