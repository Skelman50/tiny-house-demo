import { gql } from "apollo-boost";

export const LISTINGS = gql`
  query Listings($filter: ListingsFilter!, $limit: Int!, $page: Int!) {
    listings(filter: $filter, page: $page, limit: $limit) {
      result {
        id
        title
        image
        address
        price
        numOfGuests
      }
    }
  }
`;
