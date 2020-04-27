import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { List, Layout, Affix } from "antd";
import { ListingCard, ErrorBanner } from "../../lib/components";
import { RouteComponentProps, Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from "./components";

const PAGE_LIMIT = 8;

interface MAtchProps {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MAtchProps>) => {
  const locationRef = useRef(match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== match.params.location && page !== 1,
      variables: {
        filter,
        limit: PAGE_LIMIT,
        page,
        location: match.params.location,
      },
    }
  );

  useEffect(() => {
    setPage(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <div>
            <ListingsPagination
              page={page}
              setPage={setPage}
              limit={PAGE_LIMIT}
              total={listings.total}
            />
            <ListingsFilters filter={filter} setFilter={setFilter} />
          </div>
        </Affix>
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
      </div>
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

  if (loading) {
    return (
      <Layout.Content className="listings">
        <ListingsSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="listings">
        <ErrorBanner description="Something went wrong. Try again later!" />
        <ListingsSkeleton />
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Layout.Content>
  );
};
