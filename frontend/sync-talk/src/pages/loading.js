import React from 'react';

const Loading = () => {
    return (
        <div className="Loading" style={{width: '100%', height: '100%', paddingTop: 50, background: 'white', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 54, display: 'inline-flex'}}>
            <img className="Image1" style={{width: 500, height: 500, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 400}} src="https://via.placeholder.com/700x700" />
            <div className="Title" style={{width: 787, textAlign: 'center', color: '#1D3557', fontSize: 64, fontFamily: 'Roboto', fontWeight: '500', wordWrap: 'break-word'}}>Generating...</div>
</div>
    );
}

export default Loading;