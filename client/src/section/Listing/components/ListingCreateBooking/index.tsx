import React from "react";
import { Card, Divider, Button, DatePicker } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";
import moment, { Moment } from "moment";

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkInDate: Moment | null) => void;
}

export const ListingCreateBooking = ({
  price,
  setCheckInDate,
  setCheckOutDate,
  checkInDate,
  checkOutDate,
}: Props) => {
  const disableDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
      return dateIsBeforeEndOfDay;
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
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const checkOutInputDisabled = !checkInDate;

  const requestButtonDisabled = !checkOutDate || !checkInDate;

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
        >
          Request to book
        </Button>
      </Card>
    </div>
  );
};
