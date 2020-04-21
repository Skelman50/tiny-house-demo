import React, { Fragment } from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Card, Avatar, Divider, Button } from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";

interface Props {
  user: User["user"];
  viewerIsUser: boolean;
}

export const UserProfile = ({ user, viewerIsUser }: Props) => {
  console.log(user);
  const additionalDetailSection = viewerIsUser && (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>AdditionalDetails</Title>
      </div>
      <Paragraph>
        Interested in becoming TinyHouse host? Register with your Stripe
        account!
      </Paragraph>
      <Button type="primary" className="user-profile__details-cta">
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
