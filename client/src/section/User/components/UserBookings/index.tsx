import React from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { List } from "antd";
import { ListingCard } from "../../../../lib/components";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";

interface Props {
  userBookings: User["user"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

export const UserBookings = ({
  userBookings,
  bookingsPage,
  setBookingsPage,
  limit,
}: Props) => {
  const total = userBookings ? userBookings.total : null;
  const result = userBookings ? userBookings.result : null;
  const userBookingsList = (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "You have not made any bookings!" }}
      pagination={{
        position: "top",
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onShowSizeChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={(userBooking) => {
        const bookingHistory = (
          <div className="user-bookings__booking-history">
            <div>
              Check in: <Text strong>{userBooking.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{userBooking.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingHistory}
            <ListingCard listing={userBooking.listing} />
          </List.Item>
        );
      }}
    />
  );

  const userBookingsElement = (
    <div className="user-listings">
      <Title level={4} className="user-bookings__title">
        Bookings
      </Title>
      <Paragraph className="user-bookings__description">
        This section highlights the bookings you have made!
      </Paragraph>
      {userBookingsList}
    </div>
  );
  return userBookingsElement;
};
