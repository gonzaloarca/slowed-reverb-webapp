import React, { useCallback, useEffect } from "react";
import { createPlayer } from "../utils/player";
import { TrackHistoryContext } from "./TrackHistoryContextProvider";
import { TrackQueueContext } from "./TrackQueueContextProvider";
import { TracksContext } from "./TracksContextProvider";
import * as Tone from "tone";
import { db } from "../utils/db";
import { arrayBufferToBlob } from "../utils/blob";

export const PlayerContext = React.createContext(null);

const PlayerContextProvider = ({ children }) => {
	const { tracksById, getTrackFromYoutubeId, getTrackFromSpotifyId } =
		React.useContext(TracksContext);
	const { pollTrackQueue, addToTrackQueue } =
		React.useContext(TrackQueueContext);
	const { addToTrackHistory, popFromTrackHistory } =
		React.useContext(TrackHistoryContext);
	const [slowedAmount, setSlowedAmount] = React.useState(0);
	const [reverbAmount, setReverbAmount] = React.useState(0.01);
	const [player, setPlayer] = React.useState(createPlayer());
	const [isLoading, setIsLoading] = React.useState(false);
	const [toneContextCreated, setToneContextCreated] = React.useState(false);
	const toneRef = React.useRef(null);
	const reverbRef = React.useRef(null);
	const scheduleId = React.useRef(null);

	const createToneContext = useCallback(() => {
		if (!toneContextCreated) {
			setToneContextCreated(true);
			Tone.start();
		}
	}, [toneContextCreated]);

	const handleTrackProgress = useCallback(() => {
		if (!toneRef.current) {
			return;
		}

		const time = toneRef.current?.context?.transport?.seconds;
		const duration = toneRef.current?.buffer?.duration;

		const realDuration = duration / (1 - slowedAmount);
		console.log("handleTrackProgress", time, duration, realDuration);

		setPlayer((player) => ({
			...player,
			currentTime: Math.floor(time),
			duration: Math.floor(realDuration),
		}));
	}, [slowedAmount, toneRef]);

	const loadTrack = useCallback(
		async (trackId) => {
			// get audioFile from indexedDB
			const track = await db.tracks.get(trackId);

			console.log("track", track);

			// create a blob url from the audioFile, which contains arrayBuffer and type
			const blob = arrayBufferToBlob(
				track.audioFile.data,
				track.audioFile.type
			);

			console.log("file", blob);

			const url = URL.createObjectURL(blob);

			console.log("url", url);

			await toneRef.current.load(url);
		},
		[toneRef]
	);

	const playTrack = useCallback(
		(trackId) => {
			if (!toneContextCreated) {
				return;
			}

			if (!toneRef.current) {
				toneRef.current = new Tone.Player();
				reverbRef.current = new Tone.Reverb({
					wet: 0.5,
				});

				toneRef.current.connect(reverbRef.current);

				reverbRef.current.toDestination();
			}

			// first, clear any existing schedule
			if (scheduleId.current) {
				Tone.Transport.clear(scheduleId.current);
			}

			// then, clear the current track
			toneRef.current.stop();

			// load the new track
			loadTrack(trackId).then(() => {
				// then start the new track
				toneRef.current.sync().start(0);

				setPlayer((player) => ({
					...player,
					currentTrackId: trackId,
					currentTime: 0,
					duration: 0,
					isPlaying: true,
				}));
			});
		},
		[toneContextCreated, toneRef, reverbRef, loadTrack]
	);

	const selectSpotifyTrack = useCallback(
		(spotifyId) => {
			// find youtube ID from spotify ID
			const track = Object.values(tracksById).find(
				(track) => track.spotifyId === spotifyId
			);

			if (track) {
				playTrack(track.id);
			} else {
				setIsLoading(true);

				getTrackFromSpotifyId(spotifyId)
					.then((track) => {
						playTrack(track.id);
					})
					.finally(() => {
						setIsLoading(false);
					});
			}
		},
		[getTrackFromSpotifyId, playTrack, tracksById]
	);

	const selectTrack = useCallback(
		(trackId) => {
			const track = tracksById[trackId];

			if (!track) {
				setIsLoading(true);
				getTrackFromYoutubeId(trackId)
					.then((track) => {
						playTrack(track.id);
					})
					.finally(() => {
						setIsLoading(false);
					});
			} else {
				playTrack(track.id);
			}
		},
		[getTrackFromYoutubeId, playTrack, tracksById]
	);

	const resumePlayer = useCallback(() => {
		if (toneRef.current) {
			Tone.Transport.start();
		}

		setPlayer((player) => ({
			...player,
			isPlaying: true,
		}));
	}, [toneRef]);

	const pausePlayer = useCallback(() => {
		if (toneRef.current) {
			Tone.Transport.pause();
		}

		setPlayer((player) => ({
			...player,
			isPlaying: false,
		}));
	}, [toneRef]);

	const handleTrackEnd = useCallback(() => {
		const nextTrack = pollTrackQueue();

		if (nextTrack) {
			selectTrack(nextTrack.id);
		} else {
			setPlayer(
				createPlayer() // reset player
			);
		}
	}, [pollTrackQueue, selectTrack]);

	const skipToNextTrack = useCallback(() => {
		const currentTrackId = player.currentTrackId;

		if (currentTrackId) {
			addToTrackHistory(currentTrackId);
		}

		handleTrackEnd();
	}, [addToTrackHistory, handleTrackEnd, player.currentTrackId]);

	const skipToPreviousTrack = useCallback(() => {
		const previousTrackId = popFromTrackHistory();

		if (previousTrackId) {
			addToTrackQueue(player.currentTrackId);
			selectTrack(previousTrackId);
		}
	}, [
		addToTrackQueue,
		popFromTrackHistory,
		player.currentTrackId,
		selectTrack,
	]);

	const seekTo = useCallback((time) => {
		setPlayer((player) => ({
			...player,
			currentTime: time,
		}));
	}, []);

	useEffect(() => {
		if (!toneRef.current) {
			return;
		}

		// set up Transport to update progress bar
		scheduleId.current = Tone.Transport.scheduleRepeat(() => {
			handleTrackProgress();
		}, 1);

		return () => {
			Tone.Transport.clear(scheduleId.current);
		};
	}, [handleTrackProgress, toneRef]);

	return (
		<PlayerContext.Provider
			value={{
				player,
				playTrack,
				selectTrack,
				selectSpotifyTrack,
				pausePlayer,
				skipToNextTrack,
				skipToPreviousTrack,
				seekTo,
				resumePlayer,
				handleTrackProgress,
				isLoading,
				slowedAmount,
				setSlowedAmount,
				reverbAmount,
				setReverbAmount,
				reverbRef,
				toneRef,
				createToneContext,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
