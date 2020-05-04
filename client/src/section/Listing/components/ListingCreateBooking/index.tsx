import React from "react";
import { Card, Divider, Button, DatePicker } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";
import moment, { Moment } from "moment";
import Text from "antd/lib/typography/Text";
import { Viewer } from "../../../../lib/types";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { BookingIndex } from "./types";

interface Props {
  price: number;
  viewer: Viewer;
  bookingsIndex: Listing["listing"]["bookingsIndex"];
  host: Listing["listing"]["host"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkInDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({
  price,
  setCheckInDate,
  setCheckOutDate,
  checkInDate,
  checkOutDate,
  host,
  viewer,
  bookingsIndex,
  setModalVisible,
}: Props) => {
  const bookingsIndexJSON: BookingIndex = JSON.parse(bookingsIndex);
  const dateIsBooked = (currentDate: Moment) => {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();
    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disableDate = (currentDate?: Moment) => {
    if (currentDate) {
      dateIsBooked(currentDate);
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
      return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        setCheckOutDate(null);
        return displayErrorMessage(
          "You can't book of check out to be prior to check in!"
        );
      }
      let dateCursor = checkInDate;

      while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");
        const year = moment(dateCursor).year();
        const month = moment(dateCursor).month();
        const day = moment(dateCursor).date();

        if (
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
          return displayErrorMessage(
            "You can't book a period of time that overlaps existing bookings! Please try again!"
          );
        }
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const viewerIsHost = viewer.id === host.id;

  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;

  const checkOutInputDisabled = !checkInDate || checkInInputDisabled;

  const requestButtonDisabled =
    !checkOutDate ||
    !checkInDate ||
    moment(checkOutDate).isBefore(checkInDate, "days") ||
    checkInInputDisabled;

  let buttonMessage = "You won't be charged yet!";

  if (!viewer.id) {
    buttonMessage = "You have be to signed!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book own listing!";
  } else if (!host.hasWallet) {
    buttonMessage = "Host is disconnect with Stripe!";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span> / day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              onChange={(value) => setCheckInDate(value)}
              format={"YYYY/MM/DD"}
              disabledDate={disableDate}
              showToday={false}
              disabled={checkInInputDisabled}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              onChange={(value) => verifyAndSetCheckOutDate(value)}
              format={"YYYY/MM/DD"}
              disabledDate={disableDate}
              showToday={false}
              disabled={checkOutInputDisabled}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          disabled={requestButtonDisabled}
          onClick={() => setModalVisible(true)}
        >
          Request to book
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
