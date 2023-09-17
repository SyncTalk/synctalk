import React from 'react';
import { HomeBtnLink, Nav, NavLeft, NavRight, UploadBtnLink } from './NavBarElements';

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLeft>
                    <HomeBtnLink />
                </NavLeft>
                <NavRight>
                    <UploadBtnLink />
                </NavRight>
            </Nav>
        </>
    );
};

export default Navbar;


