import gql from "graphql-tag";
import { divIcon, LeafletEvent, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { graphql } from "react-apollo";
import { Map, Marker, TileLayer } from "react-leaflet";
import "../../style/MuseumMap.css";

export type MoveHandler = (e: LeafletEvent) => void;

/** MuseumMap component props. */
export interface MuseumMapProps {
  query?: string;
  boundingBox?: object;
  onMove?: MoveHandler;
}

/** MuseumMap query response. */
interface MuseumMapResponse {
  museumMapObjects?: any;
}

/** MuseumMap query variables. */
interface MuseumMapVariables {
  query?: string;
  boundingBox?: object;
}

/** MuseumMapObjects query. */
export const GET_MUSEUM_MAP_OBJECTS = gql`
  query museumMapObjects($query: String, $boundingBox: GeoBoundingBoxInput) {
    museumMapObjects(query: $query, boundingBox: $boundingBox) {
      edges {
        ... on MuseumSearchEdge {
          node {
            __typename
            id
            name
            latitude
            longitude
          }
        }
        ... on GeoPointBucketEdge {
          node {
            __typename
            geoHashKey
            latitude
            longitude
            count
          }
        }
      }
    }
  }
`;

/** Higher-order component to provide data from the GraphQL API to a React component. */
const withMuseumMapObjects = graphql<
  MuseumMapProps,
  MuseumMapResponse,
  MuseumMapVariables
>(GET_MUSEUM_MAP_OBJECTS, {
  options: ({ boundingBox, query }) => ({
    variables: {
      boundingBox,
      query
    }
  })
});

function museumMarkerIcon(museum: any) {
  return divIcon({
    className: "museum-marker",
    html: `
      <div style="width: 300px">
        <img src="${require("leaflet/dist/images/marker-icon.png")}">
        <div><span>${museum.name}</span></div>
      </div>
    `,
    iconAnchor: [13, 40],
    popupAnchor: [0, -30]
  });
}

/** Marker icon for a cluster of museums. */
function bucketMarkerIcon(count: number): any {
  const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";

  return divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: point(40, 40)
  });
}

/** MuseumMap component. */
export const MuseumMap = withMuseumMapObjects(function MuseumMap({
  data: { museumMapObjects },
  onMove
}) {
  return (
    <Map
      onmove={onMove}
      center={[38.810338, -98.323266]}
      zoom={4}
      className="h-100"
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {museumMapObjects &&
        museumMapObjects.edges.map(edge => {
          switch (edge.__typename) {
            case "GeoPointBucketEdge":
              return (
                <Marker
                  key={`bucket_${edge.node.geoHashKey}`}
                  position={[edge.node.latitude, edge.node.longitude]}
                  icon={bucketMarkerIcon(edge.node.count)}
                />
              );
            case "MuseumSearchEdge":
              return (
                <Marker
                  key={`museum_${edge.node.id}`}
                  position={[edge.node.latitude, edge.node.longitude]}
                  icon={museumMarkerIcon(edge.node)}
                />
              );
          }
        })}
    </Map>
  );
});
