import React from 'react';
import ReactLoading from 'react-loading';
import './css/Loading.css';

const Loading = () => {
    return (
        <div className="Loading" >
            <img className="Infographic" src="https://via.placeholder.com/600x600" />
            <div className="Title">
                <p>Generating</p>
                <ReactLoading type="bubbles" color="#1D3557" height={100} width={200} />
            </div>
        </div>
    );
}

export default Loading;