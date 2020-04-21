import React from "react";
import { useQuery } from "react-apollo";
import { USER } from "../../lib/graphql/queries/User";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { RouteComponentProps } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import { UserProfile } from "./components";
import { Viewer } from "../../lib/types";
import { PageSkeleton, ErrorBanner } from "../../lib/components";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

export const User = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, error, loading } = useQuery<UserData, UserVariables>(USER, {
    variables: { id: match.params.id },
  });

  const user = data ? data.user : null;

  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user && (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  );

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
      <Row gutter={12} typeof="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Layout.Content>
  );
};
