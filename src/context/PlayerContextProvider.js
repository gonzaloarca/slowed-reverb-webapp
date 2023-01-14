import React from "react";
import { createPlayer } from "../utils/player";
import { TrackHistoryContext } from "./TrackHistoryContextProvider";
import { TrackQueueContext } from "./TrackQueueContextProvider";
import { TracksContext } from "./TracksContextProvider";

export const PlayerContext = React.createContext(null);

const PlayerContextProvider = ({ children }) => {
	const { tracksById, getTrackFromYoutubeId } = React.useContext(TracksContext);
	const { pollTrackQueue, addToTrackQueue } =
		React.useContext(TrackQueueContext);
	const { addToTrackHistory, popFromTrackHistory } =
		React.useContext(TrackHistoryContext);
	const [player, setPlayer] = React.useState(createPlayer());
	const [isLoading, setIsLoading] = React.useState(false);

	const handlePlay = (track) => {
		setPlayer((player) => ({
			...player,
			currentTrackId: track.id,
			currentTime: 0,
			duration: track.duration,
			isPlaying: true,
		}));
	};

	const selectTrack = (trackId) => {
		const track = tracksById[trackId];

		if (!track) {
			setIsLoading(true);
			getTrackFromYoutubeId(trackId)
				.then(() => {
					handlePlay(tracksById[trackId]);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			handlePlay(track);
		}
	};

	const resumePlayer = () => {
		setPlayer((player) => ({
			...player,
			isPlaying: true,
		}));
	};

	const pausePlayer = () => {
		setPlayer((player) => ({
			...player,
			isPlaying: false,
		}));
	};

	const handleTrackEnd = () => {
		const nextTrack = pollTrackQueue();

		if (nextTrack) {
			selectTrack(nextTrack.id);
		} else {
			setPlayer(
				createPlayer() // reset player
			);
		}
	};

	const skipToNextTrack = () => {
		const currentTrackId = player.currentTrackId;

		if (currentTrackId) {
			addToTrackHistory(currentTrackId);
		}

		handleTrackEnd();
	};

	const skipToPreviousTrack = () => {
		const previousTrackId = popFromTrackHistory();

		if (previousTrackId) {
			addToTrackQueue(player.currentTrackId);
			selectTrack(previousTrackId);
		}
	};

	const seekTo = (time) => {
		setPlayer((player) => ({
			...player,
			currentTime: time,
		}));
	};

	return (
		<PlayerContext.Provider
			value={{
				player,
				playTrack: selectTrack,
				pausePlayer,
				skipToNextTrack,
				skipToPreviousTrack,
				seekTo,
				resumePlayer,
				isLoading,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
