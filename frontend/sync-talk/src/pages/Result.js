import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

const Result = () => {
    
    return (
        <div className="Result" >
            <div className="Title">
                
            </div>
            <div className="Content">
                <p>Generating</p>
                <ReactLoading type="bubbles" color="#1D3557" height={10} width={200} />
            </div>
        </div>
    );
}

export default Result;