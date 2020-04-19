import React from "react";
import { Layout } from "antd";

import tinyHouseLogo from "./assets/tinyhouse-logo.png";
import { Link } from "react-router-dom";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";

const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className="app-header">
      <div className="app-header-skeleton__search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img alt="logo" src={tinyHouseLogo} />
          </Link>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
