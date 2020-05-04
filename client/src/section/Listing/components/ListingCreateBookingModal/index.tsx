import React from "react";
import { Modal, Typography, Divider, Button } from "antd";
import moment, { Moment } from "moment";
import { KeyOutlined } from "@ant-design/icons";
import {
  formatListingPrice,
  displayErrorMessage,
  displaySuccessNotification,
} from "../../../../lib/utils";
import {
  injectStripe,
  ReactStripeElements,
  CardElement,
} from "react-stripe-elements";
import { useMutation } from "react-apollo";
import { CREATE_BOOKING } from "../../../../lib/graphql/mutations/CreateBooking";
import {
  CreateBooking,
  CreateBookingVariables,
} from "../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking";

interface Props {
  id: string;
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

export const ListingCreateBookingModal = ({
  modalVisible,
  price,
  checkInDate,
  checkOutDate,
  setModalVisible,
  stripe,
  id,
  clearBookingData,
  handleListingRefetch,
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const [createBooking, { loading }] = useMutation<
    CreateBooking,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification("Success book!");
      handleListingRefetch();
    },
    onError: (error) => {
      console.log(error);
      displayErrorMessage("Error book!");
    },
  });

  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = daysBooked * price;

  const handleCreateBooking = async () => {
    if (!stripe) {
      return displayErrorMessage("Sorry. Can't connect with Stripe!");
    }
    let { token: stripeToken, error } = await stripe.createToken();
    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format("YYYY-MM-DD"),
            checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message ? error.message : "Can't a book listing!"
      );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Typography.Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Typography.Title>
          <Typography.Title
            level={3}
            className="listing-booking-modal__intro-title"
          >
            Book your trip
          </Typography.Title>
          <Typography.Paragraph>
            Enter your payment information the listing from dates between{" "}
            <Typography.Text mark strong>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Typography.Text>{" "}
            and{" "}
            <Typography.Text mark strong>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Typography.Text>
            , inclusive.
          </Typography.Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__charge-summary">
          <Typography.Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Typography.Text strong>
              {formatListingPrice(listingPrice, false)}
            </Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph className="listing-booking-modal__charge-summary-total">
            Total ={" "}
            <Typography.Text mark>
              {formatListingPrice(listingPrice, false)}
            </Typography.Text>
          </Typography.Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
            loading={loading}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(
  ListingCreateBookingModal
);
