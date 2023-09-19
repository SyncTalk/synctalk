import React from "react";
import { useLocation } from "react-router-dom";
import {
  Nav,
  NavLeft,
  NavRight,
  HomeBtnLink,
  UploadBtnLink,
  DownloadBtnLink,
  AboutBtnLink,
  CancelBtnLink,
} from "./NavBarElements";

const Navbar = () => {
  const location = useLocation();
  const page = location.pathname.substring(1);
  let rightButton;

  switch (page) {
    case "result":
      rightButton = <DownloadBtnLink />;
      break;
    case "about":
      rightButton = <UploadBtnLink />;
      break;
    case "loading":
      rightButton = <CancelBtnLink />;
      break;
    default:
      rightButton = <AboutBtnLink />;
  }

  return (
    <>
      <Nav>
        <NavLeft>
          <HomeBtnLink />
        </NavLeft>
        <NavRight>{rightButton}</NavRight>
      </Nav>
    </>
  );
};

export default Navbar;
