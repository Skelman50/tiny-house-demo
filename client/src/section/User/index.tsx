import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { USER } from "../../lib/graphql/queries/User";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { RouteComponentProps } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import { UserProfile, UserListings, UserBookings } from "./components";
import { Viewer } from "../../lib/types";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { useScrollToTop } from "../../lib/hooks";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const PAGE_LIMIT = 4;

export const User = ({
  viewer,
  match,
  setViewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const { data, error, loading, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        listingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  useScrollToTop();

  const handleUserRefetch = async () => {
    await refetch();
  };

  const user = data ? data.user : null;

  const viewerIsUser = viewer.id === match.params.id;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfileElement = user && (
    <UserProfile
      user={user}
      viewerIsUser={viewerIsUser}
      viewer={viewer}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  );

  const userListingsElement = userListings && (
    <UserListings
      userListings={userListings}
      setListingsPage={setListingsPage}
      limit={PAGE_LIMIT}
      listingsPage={listingsPage}
    />
  );

  const userBookingsElement = (
    <UserBookings
      userBookings={userBookings}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
      bookingsPage={bookingsPage}
    />
  );

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error"
  );

  const stripeErrorBanner = stripeError && <ErrorBanner />;

  if (loading) {
    return (
      <Layout.Content className="user">
        <PageSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="user">
        <ErrorBanner description="Something went wrong. try Again later" />
      </Layout.Content>
    );
  }
  return (
    <Layout.Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} typeof="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Layout.Content>
  );
};
