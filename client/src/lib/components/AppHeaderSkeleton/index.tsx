import React from "react";
import { Layout } from "antd";

import tinyHouseLogo from "./assets/tinyhouse-logo.png";

const { Header } = Layout;

export const AppHeaderSkeleton = () => {
  return (
    <Header className="app-header">
      <div className="app-header-skeleton__search-section">
        <div className="app-header__logo">
          <img alt="logo" src={tinyHouseLogo} />
        </div>
      </div>
      <div className="app-header__menu-section"></div>
    </Header>
  );
};
