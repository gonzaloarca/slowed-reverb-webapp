import React from "react";
import { SongDownloaderService } from "../services/songDownloaderService";
import { db } from "../utils/db";
import { omit } from "lodash";

export const TracksContext = React.createContext(null);

const TracksContextProvider = ({ children }) => {
	const [tracksById, setTracksById] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(false);

	const getTrackFromSpotifyId = async (spotifyId) => {
		try {
			setIsLoading(true);

			// check if track is already downloaded in indexedDB
			let track = await db.tracks.where("id").equals(spotifyId).first();

			// if not, download it from spotify using the downloader API
			if (!track) {
				track = await SongDownloaderService.downloadFromSpotifyTrackId(
					spotifyId
				);

				// put the track in indexedDB
				await db.tracks.put(track);
			}

			// update the tracksById state
			setTracksById((tracksById) => ({
				...tracksById,
				[track?.id]: {
					...omit(track, ["audioFile"]),
				},
			}));

			return track;
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// const getTrackFromYoutubeId = async (youtubeId) => {
	// 	try {
	// 		setIsLoading(true);

	// 		// check if track is already downloaded in indexedDB
	// 		let track = await db.tracks.where("id").equals(youtubeId).first();

	// 		// if not, download it from youtube using the downloader API
	// 		if (!track) {
	// 			track = await SongDownloaderService.downloadFromYoutubeVideoId(
	// 				youtubeId
	// 			);

	// 			// put the track in indexedDB
	// 			await db.tracks.put(track);
	// 		}

	// 		// update the tracksById state
	// 		setTracksById((tracksById) => ({
	// 			...tracksById,
	// 			[track?.id]: {
	// 				...omit(track, ["audioFile"]),
	// 			},
	// 		}));

	// 		return track;
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	return (
		<TracksContext.Provider
			value={{
				tracksById,
				getTrackFromSpotifyId,
				isLoading,
			}}
		>
			{children}
		</TracksContext.Provider>
	);
};

export default TracksContextProvider;
