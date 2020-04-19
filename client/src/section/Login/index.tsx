import React, { useEffect, useRef } from "react";
import { Card, Layout, Typography, Spin } from "antd";
import googleLogo from "./assets/google_logo.jpg";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "react-apollo";
import { AuthUrl } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import {
  LogIn,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { LOG_IN } from "../../lib/graphql/mutations/LogIn";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../lib/utils";
import { ErrorBanner } from "../../lib/components";
import { Redirect } from "react-router-dom";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogIn, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        sessionStorage.setItem("token", data.logIn.token);
        setViewer(data.logIn);
        displaySuccessNotification("You've succesfully logged in!");
      }
    },
  });

  const logInRef = useRef(logIn);
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({ variables: { input: { code } } });
    }
  }, []);
  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrl>({ query: AUTH_URL });
      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage("Logged in error. Please try again later!");
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logginig you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerID } = logInData.logIn;
    return <Redirect to={`/user/${viewerID}`} />;
  }

  const logInErrorBannerElement = logInError && (
    <ErrorBanner description="Logged in error. Please try again later!" />
  );
  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋🏻
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with google!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            alt="Google logo"
            className="log-in-card__google-button-logo"
            src={googleLogo}
          />
          <span className="log-in-card__google-button-text">
            Sign in with google
          </span>
        </button>
      </Card>
    </Content>
  );
};
