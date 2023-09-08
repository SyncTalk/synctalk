import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavLink, Bars, NavMenu, NavBtn } from './NavBarElements';

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to='/home' activeStyle>
                        Home
                    </NavLink>
                    <NavLink to='/loading' activeStyle>
                        Loading
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;


