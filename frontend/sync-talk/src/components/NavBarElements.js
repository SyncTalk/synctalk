import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';

export const Nav = styled.nav`
    background: transparent;
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    z-index: 100;
    position: fixed;
    width: 100%;
`;

export const NavLink = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &:hover {
        color: #000d1a;
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #fff;

    @media screen and (max-width: 768px) {
        display: block;
        /* position: absolute; */
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    /* align-items: center; */
    margin-right: -48px;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    /* margin-right: 24px; */

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavBtnLink = styled(Link)`
    /* border-radius: 4px; */
    background: #256ce1;
    padding: 10px 22px;
    color: #fff;
    border: none;
    outline: none;
    /* cursor: pointer; */
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    /* &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    } */
`;

