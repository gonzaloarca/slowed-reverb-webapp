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
import audioBufferToWav from "audiobuffer-to-wav";
import { getAudioDuration } from "../utils/audio";

// const RESTART_TRACK_ON_PREVIOUS_THRESHOLD = 3;

export const PlayerContext = React.createContext(null);

const PlayerContextProvider = ({ children }) => {
	const { tracksById, getTrackFromSpotifyId } = React.useContext(TracksContext);
	const {
		playNextTrackInList,
		playPreviousTrackInList,
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
	const slowedAmountRef = React.useRef(slowedAmount);
	const currentTrackIdRef = React.useRef(null);

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

	async function getAudioBlobFromTrackId(trackId) {
		const track = await db.tracks.get(trackId);

		console.log("track", track);

		// create a blob url from the audioFile, which contains arrayBuffer and type
		const blob = arrayBufferToBlob(track.audioFile.data, track.audioFile.type);

		console.log("file", blob);

		return blob;
	}

	const handleTimeUpdate = useCallback(
		(time) => {
			setPlayer((player) => ({
				...player,
				currentTime: time,
			}));
		},
		[setPlayer]
	);

	const handleMetadataLoaded = useCallback(
		(e) => {
			const { duration } = e.target;

			setPlayer((player) => ({
				...player,
				duration,
			}));
		},
		[setPlayer]
	);

	// function selectTrack(trackId) {
	// 	const track = tracksById[trackId];

	// 	if (!track) {
	// 		setIsLoading(true);
	// 		getTrackFromYoutubeId(trackId)
	// 			.then((track) => {
	// 				playTrack(track.id);
	// 			})
	// 			.finally(() => {
	// 				setIsLoading(false);
	// 			});
	// 	} else {
	// 		playTrack(track.id);
	// 	}
	// }

	function handleTrackEnd() {
		const nextTrack = playNextTrackInList();

		if (nextTrack) {
			selectSpotifyTrack(nextTrack.id);
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

		// TODO: Avoid creating a new audio context if replaying the same track

		createAudioWithFx(trackId).finally(() => {
			setIsLoading(false);
		});
	}

	async function createAudioWithFx(trackId) {
		if (!toneContextCreated) {
			return;
		}

		const audioBlob = await getAudioBlobFromTrackId(trackId);
		const duration = await getAudioDuration(audioBlob);

		if (!duration) {
			return;
		}

		const slowedDuration = duration / (1 - slowedAmount);
		console.log("slowedDuration", slowedDuration);

		// dispose of previous Tone objects
		if (toneRef.current) {
			toneRef.current.dispose();
		}

		if (reverbRef.current) {
			reverbRef.current.dispose();
		}

		// create buffer
		const blob = await getAudioBlobFromTrackId(trackId);

		const url = URL.createObjectURL(blob);

		console.log("url", url);

		// create buffer before loading
		const buffer = await Tone.Buffer.fromUrl(url);

		return new Promise((resolve) => {
			Tone.Offline((context) => {
				reverbRef.current = new Tone.Reverb({
					wet: 0.5,
				});

				toneRef.current = new Tone.Player({
					playbackRate: 1 - slowedAmount,
				});

				toneRef.current.connect(reverbRef.current);

				reverbRef.current.connect(context.destination);

				// load the buffer
				toneRef.current.buffer.set(buffer);

				// sync the player to the transport
				toneRef.current.start(0);

				// start the transport
				// context.transport.start();
			}, slowedDuration).then((buffer) => {
				// save as wav blob in currentAudioRef
				const wavArrayBuffer = audioBufferToWav(buffer.get());

				const blob = arrayBufferToBlob(wavArrayBuffer, "audio/wav");
				const blobUrl = URL.createObjectURL(blob);
				console.log("blobUrl", blobUrl);

				setPlayer((player) => ({
					...player,
					currentAudioUrl: blobUrl,
				}));

				resolve();
			});
		});
	}

	function selectSpotifyTrack(spotifyId) {
		setPlayer((player) => ({
			...player,
			currentTrackId: spotifyId,
			currentAudioUrl: null,
			currentTime: 0,
			duration: 0,
			isPlaying: true,
		}));

		setIsLoading(true);
		currentTrackIdRef.current = spotifyId;

		// find youtube ID from spotify ID
		const track = Object.values(tracksById).find(
			(track) => track.id === spotifyId
		);

		if (track) {
			playTrack(track.id);
		} else {
			getTrackFromSpotifyId(spotifyId).then((track) => {
				// Only play track if it's still the current track,
				// as the user may have selected another track in the meantime
				if (currentTrackIdRef.current === track.id) playTrack(track.id);
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
			(trackItem) => trackItem.id === spotifyId
		);

		setTrackList(playlistItems, trackIndex, player.shuffle);

		selectSpotifyTrack(spotifyId);
	}

	const resumePlayer = useCallback(() => {
		setPlayer((player) => ({
			...player,
			isPlaying: true,
		}));
	}, []);

	function pausePlayer() {
		setPlayer((player) => ({
			...player,
			isPlaying: false,
		}));
	}

	function skipToNextTrack() {
		handleTrackEnd();
	}

	function skipToPreviousTrack() {
		// TODO: if we're out of the first N seconds, restart the current track

		const previousTrack = playPreviousTrackInList();

		if (previousTrack) {
			selectSpotifyTrack(previousTrack.id);
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
		slowedAmountRef.current = slowedAmount;
	}, [slowedAmount]);

	return (
		<PlayerContext.Provider
			value={{
				player,
				playTrack,
				selectSpotifyTrack,
				selectSpotifyTrackFromPlaylist,
				pausePlayer,
				skipToNextTrack,
				skipToPreviousTrack,
				seekTo,
				resumePlayer,
				isLoading,
				slowedAmount,
				setSlowedAmount,
				reverbAmount,
				setReverbAmount,
				reverbRef,
				toneRef,
				createToneContext,
				toggleShuffle,
				handleTrackEnd,
				handleTimeUpdate,
				handleMetadataLoaded,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
