import React from "react";
import { useQuery } from "react-apollo";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { List, Layout } from "antd";
import { ListingCard } from "../../lib/components";
import { RouteComponentProps, Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";

const PAGE_LIMIT = 8;

interface MAtchProps {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MAtchProps>) => {
  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      filter: ListingsFilter.PRICE_HIGH_TO_LOW,
      limit: PAGE_LIMIT,
      page: 1,
      location: match.params.location,
    },
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <List
        grid={{
          gutter: 8,
          sm: 2,
          lg: 4,
          xs: 1,
        }}
        dataSource={listings.result}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    ) : (
      <div>
        <Paragraph>
          It appers no listings have yet been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be a first person to create{" "}
          <Link to="/host">listing in this area </Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion && (
    <Title level={3} className="listings__title">
      Result for "{listingsRegion}"
    </Title>
  );

  return (
    <Layout.Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Layout.Content>
  );
};
