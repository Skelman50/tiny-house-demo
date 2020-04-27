import { gql } from "apollo-boost";

export const LISTINGS = gql`
  query Listings(
    $filter: ListingsFilter!
    $limit: Int!
    $page: Int!
    $location: String
  ) {
    listings(filter: $filter, page: $page, limit: $limit, location: $location) {
      region
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
