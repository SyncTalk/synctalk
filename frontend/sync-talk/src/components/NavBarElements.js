import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUpload, faDownload, faInfoCircle, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export const Nav = styled.nav`
    background: transparent;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    z-index: 100;
    position: fixed;

    @media screen and (max-width: 768px) {
        padding-top: 1rem;
    }
`;

export const NavLeft = styled.div`
    display: flex;
    align-items: center;
    margin-left: 4rem;
    @media screen and (max-width: 768px) {
        margin-left: 2rem;
    }
`;

export const NavRight = styled.div`
    display: flex;
    align-items: center;
    margin-right: 4rem;
    @media screen and (max-width: 768px) {
        margin-right: 2rem;
    }
`;

export const NavBtnLink = styled(Link)`

    aspect-ratio: 1/1;
    background: #ffffff;
    padding: 1rem;
    color: #457B9D;
    border: none;
    border-radius: 50%;
    outline: none;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #457B9D;
        color: #ffffff;
    } 

    @media screen and (max-width: 768px) {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0.5rem;
    }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    font-size: 2rem;
    @media screen and (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const HomeIcon = () => <StyledFontAwesomeIcon icon={faHome} />;

export const HomeBtnLink = () => (
    <NavBtnLink to='/home'>
        <HomeIcon />
    </NavBtnLink>
);

const UploadIcon = () => <StyledFontAwesomeIcon icon={faUpload} />;
export const UploadBtnLink = () => (
    <NavBtnLink to='/loading'>
        <UploadIcon />
    </NavBtnLink>
);

const DownloadIcon = () => <StyledFontAwesomeIcon icon={faDownload} />;
export const DownloadBtnLink = () => (
    <NavBtnLink to='/download'>
        <DownloadIcon />
    </NavBtnLink>
);

const AboutIcon = () => <StyledFontAwesomeIcon icon={faInfoCircle} />;
export const AboutBtnLink = () => (
    <NavBtnLink to='/about'>
        <AboutIcon />
    </NavBtnLink>
);

const CancelIcon = () => <StyledFontAwesomeIcon icon={faRectangleXmark} />;
export const CancelBtnLink = () => (
    <NavBtnLink to='/upload'>
        <CancelIcon />
    </NavBtnLink>
);
