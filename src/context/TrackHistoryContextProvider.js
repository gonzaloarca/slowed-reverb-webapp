import React from "react";

export const TrackHistoryContext = React.createContext(null);

const TrackHistoryContextProvider = ({ children }) => {
	const [trackHistory, setTrackHistory] = React.useState([]);

	const pushToTrackHistory = (track) => {
		setTrackHistory((history) => [...history, track]);
	};

	const clearTrackHistory = () => {
		setTrackHistory([]);
	};

	const popFromTrackHistory = () => {
		if (trackHistory.length === 0) {
			return null;
		}

		const track = trackHistory[trackHistory.length - 1];
		setTrackHistory((history) => history.slice(0, -1));

		return track;
	};

	return (
		<TrackHistoryContext.Provider
			value={{
				trackHistory,
				pushToTrackHistory,
				clearTrackHistory,
				popFromTrackHistory,
			}}
		>
			{children}
		</TrackHistoryContext.Provider>
	);
};

export default TrackHistoryContextProvider;
