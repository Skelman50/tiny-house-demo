import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { LISTING } from "../../lib/graphql/queries/Listing";
import { RouteComponentProps } from "react-router-dom";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { Layout, Row, Col } from "antd";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { ListingDetails, ListingBookings } from "./components";

interface MatchParamsProps {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = ({ match }: RouteComponentProps<MatchParamsProps>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { data, error, loading } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Layout.Content className="listings">
        <PageSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="listings">
        <ErrorBanner description="Something went wrong. Try again later!" />
      </Layout.Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookingsElement = (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  );
  return (
    <Layout.Content className="listings">
      <Row gutter={24} typeof="flex" justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
      </Row>
    </Layout.Content>
  );
};
