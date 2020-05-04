import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Spin,
  Button,
} from "antd";
import { Viewer } from "../../lib/types";
import { Link, Redirect } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import {
  BankOutlined,
  HomeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  iconColor,
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "react-apollo";
import { HOST_LISTING } from "../../lib/graphql/mutations/HostListing";
import {
  HostListing,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { useScrollToTop } from "../../lib/hooks";

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [hostListing, { data, loading }] = useMutation<
    HostListing,
    HostListingVariables
  >(HOST_LISTING, {
    onError: () => {
      displayErrorMessage("Failed create listing. Try again!");
    },
    onCompleted: () => {
      displaySuccessNotification("Your listing created!");
    },
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  useScrollToTop();

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;
    setImageBase64Value(null);
    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }
    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleSUbmitHostListing = (values: any) => {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;
    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64Value,
      price: values.price * 100,
    };

    delete input.city;
    delete input.state;
    delete input.postalCode;

    hostListing({ variables: { input } });
  };

  const onFinishFailed = () => {
    displayErrorMessage("Please compleate all require fields!");
  };

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  if (loading) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Please wair...
          </Typography.Title>
          <Typography.Text type="secondary">
            We creating your listing now...
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Typography.Title>
          <Typography.Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host a new listings! You can sign in at the{" "}
            {!viewer.id ? <Link to="/login">Login</Link> : <span>Login</span>}{" "}
            page and{" "}
            {!viewer.hasWallet && viewer.id ? (
              <Link to={`/user/${viewer.id}`}>connect</Link>
            ) : (
              <span>connect</span>
            )}{" "}
            with Stripe! )
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }
  return (
    <Layout.Content className="host-content">
      <Form
        layout="vertical"
        onFinish={handleSUbmitHostListing}
        onFinishFailed={onFinishFailed}
      >
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Hi! Let's started listing your place!
          </Typography.Title>
          <Typography.Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Typography.Text>
        </div>
        <Form.Item
          label="Home Type"
          name="type"
          rules={[{ required: true, message: "Please select home type!" }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Max # of Guests"
          name="numOfGuests"
          rules={[{ required: true, message: "Please enter num of guests" }]}
        >
          <InputNumber min={1} placeholder="4" />
        </Form.Item>
        <Form.Item
          label="Title"
          extra="Max character count of 45"
          name="title"
          rules={[
            { required: true, message: "Please enter title of your listing" },
          ]}
        >
          <Input
            placeholder="The iconic and luxurious Bel-Air mansion"
            maxLength={45}
          />
        </Form.Item>
        <Form.Item
          label="Description of listing"
          extra="Max character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter description of your listing",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Modern, clean, and iconic home of th Fresh Prince."
            maxLength={400}
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter address of your listing",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Form.Item>
        <Form.Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter city or region of your listing",
            },
          ]}
        >
          <Input placeholder="Loas Angeles" />
        </Form.Item>
        <Form.Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: "Please enter state or province of your listing",
            },
          ]}
        >
          <Input placeholder="California" />
        </Form.Item>
        <Form.Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[
            {
              required: true,
              message: "Please enter zip code of your listing",
            },
          ]}
        >
          <Input placeholder="Lease enter zip code for your listing!" />
        </Form.Item>
        <Form.Item
          label="Image"
          extra="Image must be under 1MB and type JPG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: "Please provide image of your listing",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="Image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="img" />
              ) : (
                <div>
                  {imageLoading ? <Spin /> : <PlusCircleOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>
        <Form.Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter price of your listing",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidType =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;
  if (!fileIsValidType) {
    displayErrorMessage("File type must be JPEG or PNG");
    return false;
  }
  if (!fileIsValidSize) {
    displayErrorMessage("File size must be under 1MB");
    return false;
  }
  return fileIsValidType && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callBack: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callBack(reader.result as string);
  };
};
