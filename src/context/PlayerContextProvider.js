import React, { useCallback, useEffect, useMemo } from "react";
import { createPlayer } from "../utils/player";
import { TrackListContext } from "./TrackListContextProvider";
import { TracksContext } from "./TracksContextProvider";
import * as Tone from "tone";
import { db } from "../utils/db";
import { arrayBufferToBlob } from "../utils/blob";
import { PlaylistsContext } from "./PlaylistsContextProvider";
import LibraryTabOptions from "../pages/Library/libraryTabOptions";
import { createTrack } from "../utils/tracklist";
import { shuffle as shuffleArray } from "lodash";

const TIME_UPDATE_INTERVAL = 0.1;
const RESTART_TRACK_ON_PREVIOUS_THRESHOLD = 3;

export const PlayerContext = React.createContext(null);

const PlayerContextProvider = ({ children }) => {
	const { tracksById, getTrackFromYoutubeId, getTrackFromSpotifyId } =
		React.useContext(TracksContext);
	const {
		playNextTrackInList,
		playPreviousTrackInList,
		setCurrentTrackIndex,
		setTrackList,
		shuffleTrackList,
		unshuffleTrackList,
	} = React.useContext(TrackListContext);
	const { playlists } = React.useContext(PlaylistsContext);
	const [slowedAmount, setSlowedAmount] = React.useState(0);
	const [reverbAmount, setReverbAmount] = React.useState(0.01);
	const [player, setPlayer] = React.useState(createPlayer());
	const [isLoading, setIsLoading] = React.useState(false);
	const [toneContextCreated, setToneContextCreated] = React.useState(false);
	const toneRef = React.useRef(null);
	const reverbRef = React.useRef(null);
	const scheduleId = React.useRef(null);
	const lastTimeUpdate = React.useRef(null);
	const slowedAmountRef = React.useRef(slowedAmount);
	const currentTimeRef = React.useRef(0);
	const isPausedRef = React.useRef(true);

	const spotifyPlaylistsById = useMemo(
		() => playlists?.[LibraryTabOptions.Spotify.value],
		[playlists]
	);

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

		// It is complex to refresh this function when used as a scheduled event handler in Tone.Transport
		// with the latest iteration of the slowed amount, so we use a ref for the next execution
		const now = Tone.Transport.seconds;
		const timeElapsed = TIME_UPDATE_INTERVAL * (1 - slowedAmountRef.current);

		lastTimeUpdate.current = now;

		const duration = toneRef.current?.buffer?.duration;

		currentTimeRef.current = currentTimeRef.current + timeElapsed;

		setPlayer((player) => ({
			...player,
			duration,
			currentTime: player.currentTime + timeElapsed,
		}));
	}, [slowedAmountRef, toneRef]);

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

			// create buffer before loading
			const buffer = await Tone.Buffer.fromUrl(url);

			// set the buffer
			toneRef.current.buffer.set(buffer);
		},
		[toneRef]
	);

	function selectTrack(trackId) {
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
	}

	function handleTrackEnd() {
		const nextTrack = playNextTrackInList();

		if (nextTrack) {
			if (nextTrack.id) {
				selectTrack(nextTrack.id);
			} else if (nextTrack.spotifyId) {
				selectSpotifyTrack(nextTrack.spotifyId);
			}
		} else {
			setPlayer(
				createPlayer() // reset player
			);
		}
	}

	function playTrack(trackId) {
		if (!toneContextCreated) {
			return;
		}

		// first, clear any existing schedule
		if (scheduleId.current) {
			Tone.Transport.clear(scheduleId.current);
		}

		Tone.Transport.stop();
		// reset toneRef
		if (toneRef.current) {
			toneRef.current.dispose();
		}

		if (!reverbRef.current) {
			reverbRef.current = new Tone.Reverb({
				wet: 0.5,
			});
		}

		toneRef.current = new Tone.Player({
			playbackRate: 1 - slowedAmount,
		});

		toneRef.current.connect(reverbRef.current);

		reverbRef.current.toDestination();

		toneRef.current.onstop = (source) => {
			console.log(toneRef.current._activeSources, "active sources");
			console.log(source);
			const time = currentTimeRef.current;
			const duration = toneRef.current?.buffer?.duration;
			console.log(
				"onstop time",
				time,
				"duration",
				duration,
				"paused",
				isPausedRef.current
			);
			if (!isPausedRef.current) {
				skipToNextTrack();
				console.log("onend!!!!");
			}
			console.log("onstop!!!!");
		};

		// isPausedRef.current = true; // just for initialization

		// load the new track
		loadTrack(trackId).then(() => {
			console.log("after load track", toneRef.current?.loaded);

			if (toneRef.current?.loaded) {
				// then start the new track
				toneRef.current.sync().start(0);

				Tone.Transport.start();

				// set up Transport to update progress bar
				scheduleId.current = Tone.Transport.scheduleRepeat(() => {
					handleTrackProgress();
				}, TIME_UPDATE_INTERVAL);

				// save timestamp for computing track progress
				lastTimeUpdate.current = 0;
			}
		});

		currentTimeRef.current = 0;

		setPlayer((player) => ({
			...player,
			currentTrackId: trackId,
			currentTime: 0,
			duration: 0,
			isPlaying: true,
		}));
	}

	function selectSpotifyTrack(spotifyId) {
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
	}

	function selectSpotifyTrackFromPlaylist(spotifyId, playlistId) {
		// set queue to tracks from playlist
		let playlistItems = spotifyPlaylistsById[playlistId]?.tracks?.items?.map(
			(trackItem) =>
				createTrack({
					spotifyId: trackItem.track.id,
				})
		);

		const trackIndex = playlistItems.findIndex(
			(trackItem) => trackItem.spotifyId === spotifyId
		);

		setTrackList(playlistItems, trackIndex, player.shuffle);

		selectSpotifyTrack(spotifyId);
	}

	const resumePlayer = useCallback(() => {
		if (toneRef.current?.loaded) {
			Tone.Transport.start();
			isPausedRef.current = false;
		}

		setPlayer((player) => ({
			...player,
			isPlaying: true,
		}));
	}, [toneRef]);

	function pausePlayer() {
		if (toneRef.current?.loaded) {
			isPausedRef.current = true;
			Tone.Transport.pause();
		}

		setPlayer((player) => ({
			...player,
			isPlaying: false,
		}));
	}

	function skipToNextTrack() {
		handleTrackEnd();
	}

	function skipToPreviousTrack() {
		// if we're out of the first N seconds, restart the current track
		if (Tone.Transport.seconds > RESTART_TRACK_ON_PREVIOUS_THRESHOLD) {
			playTrack(player.currentTrackId);
			return;
		}

		const previousTrack = playPreviousTrackInList();

		if (previousTrack) {
			if (previousTrack.id) {
				selectTrack(previousTrack.id);
			} else if (previousTrack.spotifyId) {
				selectSpotifyTrack(previousTrack.spotifyId);
			}
		}
	}

	const toggleShuffle = useCallback(() => {
		setPlayer((player) => {
			const shuffle = !player.shuffle;

			if (shuffle) {
				shuffleTrackList();
			} else {
				unshuffleTrackList();
			}

			return {
				...player,
				shuffle,
			};
		});
	}, [shuffleTrackList, unshuffleTrackList]);

	const seekTo = useCallback((time) => {
		setPlayer((player) => ({
			...player,
			currentTime: time,
		}));
	}, []);

	useEffect(() => {
		if (toneRef.current?.loaded) {
			toneRef.current.playbackRate = 1 - slowedAmount;
		}

		slowedAmountRef.current = slowedAmount;
	}, [slowedAmount]);

	return (
		<PlayerContext.Provider
			value={{
				player,
				playTrack,
				selectTrack,
				selectSpotifyTrack,
				selectSpotifyTrackFromPlaylist,
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
				toggleShuffle,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
