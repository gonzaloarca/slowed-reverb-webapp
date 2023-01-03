import { songDownloaderApi } from "../api/songDownloaderApi";

export const SongDownloaderService = {
	downloadFromArtistAndTitle: async (artist, title) => {
		const response = await songDownloaderApi.get("/from-artist-title", {
			params: {
				artist,
				title,
			},
			headers: {
				"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
			},
			responseType: "blob",
		});

		return response.data;
	},
	downloadFromSpotifyTrackId: async (trackId) => {
		const response = await songDownloaderApi.get("/from-spotify-id", {
			params: {
				id: trackId,
			},
			headers: {
				"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
				"x-spotify-client-id": process.env.REACT_APP_SPOTIFY_CLIENT_ID,
				"x-spotify-client-secret": process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
			},
		});

		return response.data;
	},
	downloadFromYoutubeVideoId: async (videoId) => {
		const response = await songDownloaderApi.get("/from-youtube-id", {
			params: {
				id: videoId,
			},
			headers: {
				"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
			},
		});

		return response.data;
	},
};
