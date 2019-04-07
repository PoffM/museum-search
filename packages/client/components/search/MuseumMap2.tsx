import { LeafletEvent } from "leaflet";
import { debounce } from "lodash";
import { bboxes } from "ngeohash";
import { useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { MapTile } from "./MapTile";

/** MuseumMap component props. */
export interface IMuseumMapProps {
  query?: string;
}

export type MoveHandler = (e: LeafletEvent) => void;

export function MuseumMap() {
  const [geohashes, setGeohashes] = useState<string[]>([]);

  const onMove = debounce<MoveHandler>(event => {
    setGeohashes(visibleGeohashes(event));
  }, 200);

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
      {geohashes.map(geohash => (
        <MapTile geohash={geohash} key={geohash} />
      ))}
    </Map>
  );
}

function visibleGeohashes(event: LeafletEvent) {
  const box = event.target.getBounds();
  let precision = 0;

  let geohashes = [];
  while (geohashes.length < 10) {
    precision++;

    geohashes = bboxes(
      box.getSouth(),
      box.getWest(),
      box.getNorth(),
      box.getEast(),
      precision
    );
  }
  
  return geohashes;
}
