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
		trackList,
	} = React.useContext(TrackListContext);
	const { playlists } = React.useContext(PlaylistsContext);
	const [slowedAmount, setSlowedAmount] = React.useState(0);
	const [reverbAmount, setReverbAmount] = React.useState(0.01);
	const [player, setPlayer] = React.useState(createPlayer());
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState(null);
	// const [toneContextCreated, setToneContextCreated] = React.useState(false);
	const toneRef = React.useRef(null);
	const reverbRef = React.useRef(null);
	const slowedAmountRef = React.useRef(slowedAmount);
	const currentTrackIdRef = React.useRef(null);
	const audioRef = React.useRef(null);
	const audioContextRef = React.useRef(null);
	const trackListRef = React.useRef(null);

	const spotifyPlaylistsById = useMemo(
		() => playlists?.[LibraryTabOptions.Spotify.value],
		[playlists]
	);

	// const createToneContext = useCallback(() => {
	// 	if (!toneContextCreated) {
	// 		setToneContextCreated(true);
	// 		Tone.start();
	// 		audioContextRef.current = new AudioContext();
	// 	}
	// }, [toneContextCreated]);

	const currentTrackMetadata = useMemo(() => {
		if (!player.currentTrackId) return null;

		const track = trackList.find((track) => track.id === player.currentTrackId);

		if (!track) {
			console.log("track not found while getting metadata in tracklist");
			return null;
		}

		return {
			...track.metadata,
		};
	}, [player?.currentTrackId, trackList]);

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

	const createAudioWithFx = useCallback(
		async (trackId) => {
			console.log("createAudioWithFx");

			// if (!toneContextCreated) {
			// 	console.log("tone context not created");
			// 	return;
			// }

			const audioBlob = await getAudioBlobFromTrackId(trackId);
			const duration = await getAudioDuration(audioBlob);

			if (!duration) {
				console.log("no duration");
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

			console.log("original url", url);

			// create buffer before loading
			const buffer = await Tone.Buffer.fromUrl(url);

			return new Promise((resolve) => {
				Tone.Offline((context) => {
					console.log("creating slow + reverb audio");
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

					console.log("starting transport");

					// start the transport
					// context.transport.start();
				}, slowedDuration)
					.then((buffer) => {
						console.log("finished processing audio");
						// save as wav blob in currentAudioRef
						const wavArrayBuffer = audioBufferToWav(buffer.get());

						const blob = arrayBufferToBlob(wavArrayBuffer, "audio/wav");
						const blobUrl = URL.createObjectURL(blob);
						console.log("slowed + reverb audio url", blobUrl);

						setPlayer((player) => ({
							...player,
							currentAudioUrl: blobUrl,
						}));

						resolve();
					})
					.catch((err) => {
						console.error(err);
					});
			});
		},
		[slowedAmount]
	);

	const playTrack = useCallback(
		(trackId) => {
			console.log("playTrack", trackId);
			// TODO: Avoid creating a new audio context if replaying the same track

			console.log("creating audio with fx");
			createAudioWithFx(trackId).finally(() => {
				setIsLoading(false);
			});
		},
		[createAudioWithFx]
	);

	const selectSpotifyTrack = useCallback(
		(spotifyId) => {
			console.log("selectSpotifyTrack", spotifyId);

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
				getTrackFromSpotifyId(spotifyId)
					.then((track) => {
						// Only play track if it's still the current track,
						// as the user may have selected another track in the meantime
						if (currentTrackIdRef.current === track.id) playTrack(track.id);
					})
					.catch((err) => {
						console.error(err);

						setError("An error occurred while downloading the track");
					});
			}
		},
		[getTrackFromSpotifyId, playTrack, tracksById]
	);

	const handleTrackEnd = useCallback(() => {
		console.log("HANDLE TRACK END");
		debugger;
		const nextTrack = playNextTrackInList();

		if (nextTrack) {
			selectSpotifyTrack(nextTrack.id);
		} else {
			setPlayer(
				createPlayer() // reset player
			);
		}
	}, [playNextTrackInList, selectSpotifyTrack]);

	function selectSpotifyTrackFromPlaylist(spotifyId, playlistId) {
		let playlistItems = spotifyPlaylistsById[playlistId]?.tracks?.items?.map(
			(trackItem) => createTrack(trackItem)
		);

		const trackIndex = playlistItems.findIndex(
			(trackItem) => trackItem.id === spotifyId
		);

		setTrackList(playlistItems, trackIndex, player.shuffle);
		trackListRef.current = playlistItems;

		selectSpotifyTrack(spotifyId);
	}

	const resumePlayer = useCallback(() => {
		setPlayer((player) => ({
			...player,
			isPlaying: true,
		}));
	}, []);

	const pausePlayer = useCallback(() => {
		setPlayer((player) => ({
			...player,
			isPlaying: false,
		}));
	}, []);

	const skipToNextTrack = useCallback(() => {
		console.log("skipToNextTrack");
		handleTrackEnd();
	}, [handleTrackEnd]);

	const skipToPreviousTrack = useCallback(() => {
		// TODO: if we're out of the first N seconds, restart the current track

		const previousTrack = playPreviousTrackInList();

		if (previousTrack) {
			selectSpotifyTrack(previousTrack.id);
		}
	}, [playPreviousTrackInList, selectSpotifyTrack]);

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
		if (audioRef.current) {
			audioRef.current.currentTime = time;
		}

		setPlayer((player) => ({
			...player,
			currentTime: time,
		}));
	}, []);

	const mediaSessionSeekTo = useCallback(
		(e) => {
			console.log("mediaSessionSeekTo", e);
			seekTo(e.seekTime);
		},
		[seekTo]
	);

	useEffect(() => {
		slowedAmountRef.current = slowedAmount;
	}, [slowedAmount]);

	// effect for setting up Media Session Metadata
	// useEffect(() => {
	// 	if (!("mediaSession" in navigator)) {
	// 		return;
	// 	}

	// 	setMediaSessionMetadataFromTracklist(player.currentTrackId);

	// 	// const track = tracksById[player.currentTrackId];

	// 	// if (!track) {
	// 	// 	console.log("no track found in tracksById, not setting media session metadata");
	// 	// 	return;
	// 	// }

	// 	// const artworkArrayBuffer = track.metadata.common?.picture?.[0]?.data;

	// 	// let artwork = [];

	// 	// if (artworkArrayBuffer) {
	// 	// 	const artworkMimeType = track.metadata.common.picture[0].format;
	// 	// 	const artworkBlob = arrayBufferToBlob(
	// 	// 		artworkArrayBuffer,
	// 	// 		artworkMimeType
	// 	// 	);
	// 	// 	const artworkUrl = URL.createObjectURL(artworkBlob);

	// 	// 	artwork = [
	// 	// 		{
	// 	// 			src: artworkUrl,
	// 	// 			sizes: "96x96,128x128,192x192,256x256,384x384,512x512",
	// 	// 			type: artworkMimeType,
	// 	// 		},
	// 	// 	];
	// 	// }

	// 	// navigator.mediaSession.metadata = new MediaMetadata({
	// 	// 	title: track.metadata.common.title,
	// 	// 	artist: track.metadata.common.artist,
	// 	// 	album: track.metadata.common.album,
	// 	// 	artwork,
	// 	// });
	// }, [player.currentTrackId, tracksById, setMediaSessionMetadataFromTracklist]);

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
				toggleShuffle,
				handleTrackEnd,
				handleTimeUpdate,
				handleMetadataLoaded,
				audioRef,
				audioContextRef,
				error,
				setError,
				currentTrackMetadata,
				mediaSessionSeekTo,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
