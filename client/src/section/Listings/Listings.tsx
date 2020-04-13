import React from "react";
import { useQuery, useMutation } from "react-apollo";
import { Listing as ListingsData } from "./__generated__/Listing";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { gql } from "apollo-boost";

interface Props {
  title: string;
}

const LISTINGS = gql`
  query Listing {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListings,
    { error: deleteListingError, loading: deleteListingLoading },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const HandleDeleteListing = async (id: string) => {
    await deleteListings({ variables: { id } });
    refetch();
  };

  const listings = data && data.listings;

  const listingsList = listings && (
    <ul>
      {listings.map((listing) => (
        <li key={listing.id}>
          {listing.address}{" "}
          <button onClick={() => HandleDeleteListing(listing.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  const deleteMessageLoading = deleteListingLoading && (
    <h2>Delete in process;</h2>
  );
  const deleteMessageError = deleteListingError && (
    <h2>Something went wrong! try again later!</h2>
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error || deleteListingError) {
    return <h2>Something went wrong! try again later!</h2>;
  }

  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteMessageLoading}
      {deleteMessageError}
    </div>
  );
};
