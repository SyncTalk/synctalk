import React, { useState, useEffect } from 'react';

const Text = ({ text, currentTime }) => {
    const [currentLine, setCurrentLine] = useState(0);

    useEffect(() => {
        // Find the current line based on the current time
        const newLine = text.findIndex((line, index) => {
            const nextLineTime = text[index + 1]?.time || Infinity;
            return currentTime >= line.time && currentTime < nextLineTime;
        });

        // Update the current line state
        if (newLine !== currentLine) {
            setCurrentLine(newLine);
        }
    }, [text, currentTime, currentLine]);

    return (
        <div className="Text">
            {text && text.map((line, index) => (
                <p key={index} className={index === currentLine ? 'highlighted' : ''}>
                    {line.text}
                </p>
            ))}
        </div>
    );
};

export default Text;