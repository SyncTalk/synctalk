const ProgressBar = ({ now, label }) => {
    return (
        <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: `${now}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
            </div>
            <div className="flex justify-between text-xs">
                <div>{label}</div>
                <div>{now}%</div>
            </div>
        </div>
    );
};

export default ProgressBar;