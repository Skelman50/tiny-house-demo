import React from "react";
import { Layout } from "antd";

import tinyHouseLogo from "./assets/tinyhouse-logo.png";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import Search from "antd/lib/input/Search";
import { displayErrorMessage } from "../../lib/utils";

const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, history, location }: Props & RouteComponentProps) => {
    const onSearch = (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please, enter a valid search!");
      }
    };

    const appHeaderSearchElement = location.pathname.startsWith(
      "/listings"
    ) && (
      <div className="app-header__search-input">
        <Search
          placeholder="Search 'San Fransisco'"
          enterButton
          onSearch={onSearch}
        />
      </div>
    );
    return (
      <Header className="app-header">
        <div className="app-header-skeleton__search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img alt="logo" src={tinyHouseLogo} />
            </Link>
          </div>
          {appHeaderSearchElement}
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
