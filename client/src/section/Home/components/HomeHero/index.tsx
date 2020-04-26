import React from "react";
import { Row, Col, Card } from "antd";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import { Link } from "react-router-dom";

import torontoImage from "../../assets/toronto.jpg";
import dubaiImage from "../../assets/dubai.jpg";
import londonImage from "../../assets/london.jpg";
import losAngelesImage from "../../assets/los-angeles.jpg";

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">Find a place</Title>
        <Search
          placeholder="Search 'San-Francisco'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col md={6} xs={12}>
          <Link to="/listings/toronto">
            <Card cover={<img src={torontoImage} alt="city" />}>Toronto</Card>
          </Link>
        </Col>
        <Col md={6} xs={12}>
          <Link to="/listings/dubai">
            <Card cover={<img src={dubaiImage} alt="city" />}>Dubai</Card>
          </Link>
        </Col>
        <Col md={6} xs={0}>
          <Link to="/listings/los%20angeles">
            <Card cover={<img src={losAngelesImage} alt="city" />}>
              Los Angeles
            </Card>
          </Link>
        </Col>
        <Col md={6} xs={0}>
          <Link to="/listings/london">
            <Card cover={<img src={londonImage} alt="city" />}>London</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
