import React from "react";
import { useQuery, useMutation } from "react-apollo";
import { Listing as ListingsData } from "./__generated__/Listing";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { gql } from "apollo-boost";

import "./styles/Listing.css";
import { Button, Avatar, List, Spin, Alert } from "antd";
import { ListingsSkeleton } from "./components";

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

  const handleDeleteListing = async (id: string) => {
    await deleteListings({ variables: { id } });
    refetch();
  };

  const listings = data && data.listings;

  const listingsList = listings && (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              onClick={() => handleDeleteListing(listing.id)}
              type="primary"
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  );

  const deleteListingsAlert = deleteListingError && (
    <Alert
      type="error"
      message="Something went wrong! try again later!"
      className="listings__alert"
    />
  );

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        <h2>{title}</h2>
        {deleteListingsAlert}
        {listingsList}
      </Spin>
    </div>
  );
};
