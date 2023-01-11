import React from "react";

export const TrackQueueContext = React.createContext(null);

const TrackQueueContextProvider = ({ children }) => {
	const [trackQueue, setTrackQueue] = React.useState([]);

	const addToTrackQueue = (tracks) => {
		setTrackQueue((queue) => [...queue, ...tracks]);
	};

	const removeFromTrackQueue = (trackId) => {
		setTrackQueue((queue) => queue.filter((track) => track.id !== trackId));
	};

	const clearTrackQueue = () => {
		setTrackQueue([]);
	};

	const pollTrackQueue = () => {
		if (trackQueue.length === 0) {
			return null;
		}

		const track = trackQueue[0];

		setTrackQueue((queue) => queue.slice(1));

		return track;
	};

	return (
		<TrackQueueContext.Provider
			value={{
				trackQueue,
				addToTrackQueue,
				removeFromTrackQueue,
				clearTrackQueue,
				pollTrackQueue,
			}}
		>
			{children}
		</TrackQueueContext.Provider>
	);
};

export default TrackQueueContextProvider;
