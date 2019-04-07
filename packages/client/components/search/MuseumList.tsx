import gql from "graphql-tag";
import { graphql } from "react-apollo";

/** MuseumList component props. */
export interface IMuseumListProps {
  onItemHover: (hoveredItem: object) => void;
  query?: string;
}

/** MuseumList query response. */
interface IMuseumListResponse {
  museums: any;
}

/** MuseumList query variables. */
interface IMuseumListVariables {
  query?: string;
}

/** MuseumList query. */
export const GET_MUSEUM_LIST = gql`
  query($query: String) {
    museums(query: $query, first: 50) {
      edges {
        node {
          id
          name
          streetAddress
          city
          state
          latitude
          longitude
        }
      }
      count
    }
  }
`;

/** Higher-order component to provide data from the GraphQL API to a React component. */
const withMuseumList = graphql<
  IMuseumListProps,
  IMuseumListResponse,
  IMuseumListVariables
>(GET_MUSEUM_LIST, {
  options: ({ query }) => ({
    variables: {
      query
    }
  })
});

/** MuseumList component. */
export const MuseumList = withMuseumList(function MuseumListInternal({
  data: { loading, error, museums },
  onItemHover
}) {
  return (
    <ul className="list-group">
      <style jsx={true}>{`
        .list-group-item:hover {
          border: 3px solid red;
        }
      `}</style>
      {loading && "Loading..."}
      {error && <div className="alert alert-danger">{error.message}</div>}
      {museums &&
        museums.edges.map(edge => (
          <li
            key={edge.node.id}
            className="list-group-item"
            onMouseEnter={() => onItemHover(edge.node)}
            onMouseLeave={() => onItemHover(null)}
          >
            <strong>{edge.node.name}</strong>
            <div>{edge.node.streetAddress}</div>
            <div>
              {[edge.node.city, edge.node.state]
                .filter(it => it || false)
                .join(" - ")}
            </div>
          </li>
        ))}
    </ul>
  );
});
