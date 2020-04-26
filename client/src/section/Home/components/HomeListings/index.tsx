import React from "react";
import { Listings } from "../../../../lib/graphql/queries/Listings/__generated__/Listings";
import Title from "antd/lib/typography/Title";
import { List } from "antd";
import { ListingCard } from "../../../../lib/components";

interface Props {
  title: string;
  listings: Listings["listings"]["result"];
}

export const HomeListings = ({ title, listings }: Props) => {
  return (
    <div className="home__listings">
      <Title level={4} className="home-listings__title">
        {title}
      </Title>
      <List
        grid={{
          gutter: 8,
          lg: 4,
          xs: 1,
          sm: 2,
        }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
};
