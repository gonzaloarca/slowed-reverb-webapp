import React from "react";

export const TrackListContext = React.createContext(null);

const TrackListContextProvider = ({ children }) => {
	const [trackList, setTrackList] = React.useState([]);
	const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);

	const addToTrackList = (tracks) => {
		setTrackList((oldTracks) => {
			const newTrackList = [...oldTracks, ...tracks];
			console.log("addToTrackList: newTrackList", newTrackList);

			return newTrackList;
		});
	};

	const addToTrackListAt = (track, index) => {
		setTrackList((oldTracks) => {
			const newTrackList = [...oldTracks];
			newTrackList.splice(index, 0, track);
			console.log("addToTrackListAt: newTrackList", newTrackList);

			return newTrackList;
		});
	};

	const removeFromTrackList = (trackId) => {
		setTrackList((oldTracks) =>
			oldTracks.filter((track) => track.id !== trackId)
		);
	};

	const clearTrackList = () => {
		setTrackList([]);
	};

	const playNextTrackInList = () => {
		if (currentTrackIndex === trackList.length - 1) {
			return null;
		}

		const nextTrack = trackList[currentTrackIndex + 1];
		setCurrentTrackIndex((index) => index + 1);

		return nextTrack;
	};

	const playPreviousTrackInList = () => {
		if (currentTrackIndex === 0) {
			return null;
		}

		const previousTrack = trackList[currentTrackIndex - 1];
		setCurrentTrackIndex((index) => index - 1);

		return previousTrack;
	};

	return (
		<TrackListContext.Provider
			value={{
				trackList,
				setTrackList,
				addToTrackList,
				addToTrackListAt,
				removeFromTrackList,
				clearTrackList,
				currentTrackIndex,
				setCurrentTrackIndex,
				playNextTrackInList,
				playPreviousTrackInList,
			}}
		>
			{children}
		</TrackListContext.Provider>
	);
};

export default TrackListContextProvider;
