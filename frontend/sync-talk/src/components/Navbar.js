import React from 'react';
import { Nav, NavLeft, NavRight, HomeBtnLink, UploadBtnLink, DownloadBtnLink, AboutBtnLink } from './NavBarElements';

const Navbar = ({ page }) => {
    let rightButton;

    switch (page) {
        case 'result':
            rightButton = <DownloadBtnLink />;
            break;
        case 'about':
            rightButton = <UploadBtnLink />;
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
                <NavRight>
                    {rightButton}
                </NavRight>
            </Nav>
        </>
    );
};

export default Navbar;