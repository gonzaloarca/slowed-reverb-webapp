import { songDownloaderApi } from "../api/songDownloaderApi";
import { createTrack } from "../utils/tracks";

const extractMetadata = (res) => {
	const title = res.headers["x-title"];
	const artist = res.headers["x-artist"];
	const duration = res.headers["x-duration"];
	const youtubeId = res.headers["x-youtube-id"];
	const contentDisposition = res.headers["content-disposition"];
	const fileName = contentDisposition?.split("filename=")[1];

	return { title, artist, duration, youtubeId, fileName };
};

const downloadFromArtistAndTitle = async (artist, title) => {
	const response = await songDownloaderApi.get("/download/from-artist-title", {
		params: {
			artist,
			title,
		},
		headers: {
			"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
		},
		responseType: "blob",
	});

	const metadata = extractMetadata(response);

	return createTrack({
		...metadata,
		audioBlob: response.data,
	});
};

const downloadFromSpotifyTrackId = async (trackId) => {
	const response = await songDownloaderApi.get("/download/from-spotify-id", {
		params: {
			id: trackId,
		},
		headers: {
			"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
			"x-spotify-client-id": process.env.REACT_APP_SPOTIFY_CLIENT_ID,
			"x-spotify-client-secret": process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
		},
	});

	const metadata = extractMetadata(response);

	return createTrack({
		...metadata,
		spotifyId: trackId,
		audioBlob: response.data,
	});
};

const downloadFromYoutubeVideoId = async (videoId) => {
	const response = await songDownloaderApi.get("/download/from-youtube-id", {
		params: {
			id: videoId,
		},
		headers: {
			"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
		},
	});

	const metadata = extractMetadata(response);

	return createTrack({
		...metadata,
		audioBlob: response.data,
	});
};

const getSpotifyCredentials = async (code, state) => {
	const response = await songDownloaderApi.get("/auth/spotify/callback", {
		params: {
			code,
			state,
		},
	});

	const { access_token, expires_in, refresh_token } = response.data;

	const expiresAt = new Date().getTime() + expires_in * 1000;

	return {
		accessToken: access_token,
		expiresAt,
		refreshToken: refresh_token,
	};
};

const refreshSpotifyCredentials = async (refreshToken) => {
	const response = await songDownloaderApi.get("/auth/spotify/refresh", {
		params: {
			refresh_token: refreshToken,
		},
	});

	const { access_token, expires_in } = response.data;

	const expiresAt = new Date().getTime() + expires_in * 1000;

	return {
		accessToken: access_token,
		expiresAt,
	};
};

export const SongDownloaderService = {
	downloadFromArtistAndTitle,
	downloadFromSpotifyTrackId,
	downloadFromYoutubeVideoId,
	getSpotifyCredentials,
	refreshSpotifyCredentials,
};
