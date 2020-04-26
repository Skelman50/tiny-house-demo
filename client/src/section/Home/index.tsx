import React from "react";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";
import { Layout, Row, Col } from "antd";
import { RouteComponentProps, Link } from "react-router-dom";
import { displayErrorMessage } from "../../lib/utils";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

import mapBackground from "./assets/map-background.jpg";
import sanFrancisco from "./assets/san-fransisco.jpg";
import cancun from "./assets/cancun.jpg";
import { useQuery } from "react-apollo";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import {
  Listings,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { loading, data } = useQuery<Listings, ListingsVariables>(LISTINGS, {
    variables: {
      filter: ListingsFilter.PRICE_HIGH_TO_LOW,
      limit: PAGE_LIMIT,
      page: PAGE_NUMBER,
    },
  });

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please Enter a valid value!");
    }
  };

  const renderListingsSkeleton = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }
    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }
    return null;
  };

  return (
    <Layout.Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in USA
        </Link>
      </div>

      {renderListingsSkeleton()}

      <div className="home__listings">
        <Title level={4} className="home-listings__title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20francisco">
              <div className="home__listings-img-cover">
                <img
                  src={sanFrancisco}
                  alt="cover"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancun">
              <div className="home__listings-img-cover">
                <img src={cancun} alt="cover" className="home__listings-img" />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Layout.Content>
  );
};
