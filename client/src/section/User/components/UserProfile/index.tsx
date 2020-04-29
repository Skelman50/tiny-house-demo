import React, { Fragment } from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Card, Avatar, Divider, Button, Tag } from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import {
  formatListingPrice,
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";
import { useMutation } from "react-apollo";
import { DISCONNECT_STRIPE } from "../../../../lib/graphql/mutations/DisconnectStripe";
import { DisconnectStripe } from "../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe";
import { Viewer } from "../../../../lib/types";

interface Props {
  user: User["user"];
  viewerIsUser: boolean;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => void;
}

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

export const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  handleUserRefetch,
  setViewer,
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripe>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          displaySuccessNotification("Success disconnect Stripe!");
          handleUserRefetch();
        }
      },
      onError: () => {
        displayErrorMessage("Failed disconnect from Stripe!");
      },
    }
  );
  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <Fragment>
      <Paragraph>
        <Tag color="green">Stripe registered!</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned:{" "}
        <Text strong>
          {user.income ? formatListingPrice(user.income) : `$0`}
        </Text>
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        DIsconnect Stripe
      </Button>
      <Paragraph type="secondary">
        By disconnecting you won't be able to receive{" "}
        <Text strong>any further payments</Text>. This will prevent users from
        booking listings that you might have already created.
      </Paragraph>
    </Fragment>
  ) : (
    <Fragment>
      <Paragraph>
        Interested in becoming TinyHouse host? Register with your Stripe
        account!
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={redirectToStripe}
      >
        Connect with stripe
      </Button>
      <Paragraph type="secondary">
        TinyHouse uses{" "}
        <a
          href="https://stripe.com/en-US/connect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Strile
        </a>{" "}
        to help transfer your earnings in a secure and truster manner.
      </Paragraph>
    </Fragment>
  );

  const additionalDetailSection = viewerIsUser && (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>AdditionalDetails</Title>
      </div>
      {additionalDetails}
    </Fragment>
  );
  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailSection}
      </Card>
    </div>
  );
};
