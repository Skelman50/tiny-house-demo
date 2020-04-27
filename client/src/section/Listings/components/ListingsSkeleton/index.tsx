import React from "react";
import { List, Skeleton, Card } from "antd";

import listingsLoadingCard from "../../assets/listing-loading-card-cover.jpg";

export const ListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <div className="home__listings-skeleton">
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{
          gutter: 8,
          lg: 4,
          xs: 1,
          sm: 2,
        }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${listingsLoadingCard})` }}
                  className="listings-skeleton__card-cover-img"
                />
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
