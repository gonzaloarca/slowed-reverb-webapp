import React, { useCallback } from "react";
import { shuffle as shuffleArray } from "lodash";

export const TrackListContext = React.createContext(null);

const TrackListContextProvider = ({ children }) => {
	const [trackList, setTrackList] = React.useState([]);
	const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
	const originalTrackList = React.useRef([]);

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

	const shuffleTrackList = useCallback(
		(fromTrackIndex = null) => {
			let trackIndex = currentTrackIndex;

			if (fromTrackIndex !== null) {
				trackIndex = fromTrackIndex;
			}

			// remove current track from track list, shuffle, then add current track back in
			setTrackList((oldTracks) => {
				const currentTrack = oldTracks[trackIndex];

				// remove current track from track list
				let newTrackList = oldTracks.filter((_, index) => index !== trackIndex);

				// shuffle track list
				newTrackList = shuffleArray(newTrackList);

				// add current track back in
				newTrackList = [currentTrack, ...newTrackList];

				setCurrentTrackIndex(0);

				return newTrackList;
			});
		},
		[currentTrackIndex]
	);

	const unshuffleTrackList = useCallback(() => {
		setTrackList((oldTracks) => {
			const currentTrack = oldTracks[currentTrackIndex];

			// find index of current track in original track list
			const originalTrackIndex = originalTrackList.current.findIndex(
				(track) => track.id === currentTrack.id
			);

			setCurrentTrackIndex(originalTrackIndex);

			return originalTrackList.current;
		});
	}, [currentTrackIndex]);

	const _setTrackList = (newTrackList, fromTrackIndex, shuffle = false) => {
		originalTrackList.current = newTrackList;

		setTrackList(newTrackList);
		setCurrentTrackIndex(fromTrackIndex);

		if (shuffle) {
			shuffleTrackList(fromTrackIndex);
		}
	};

	return (
		<TrackListContext.Provider
			value={{
				trackList,
				setTrackList: _setTrackList,
				addToTrackList,
				addToTrackListAt,
				removeFromTrackList,
				clearTrackList,
				currentTrackIndex,
				setCurrentTrackIndex,
				playNextTrackInList,
				playPreviousTrackInList,
				shuffleTrackList,
				unshuffleTrackList,
			}}
		>
			{children}
		</TrackListContext.Provider>
	);
};

export default TrackListContextProvider;
