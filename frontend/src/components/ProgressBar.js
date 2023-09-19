const ProgressBar = ({ currentTime, duration }) => {

    const handleSeek = (event) => {
        const audio = document.getElementById('audio');
        const seekTime = (event.nativeEvent.offsetX / event.target.offsetWidth) * audio.duration;
        audio.currentTime = seekTime;
    };

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="ProgressBar">
            <span>{formatTime(currentTime)}</span>
            <progress
                    className="Progress"
                    value={currentTime}
                    max={duration}
                    onClick={handleSeek}
            />
            <span>{formatTime(duration)}</span>
        </div>
    );
};

export default ProgressBar;