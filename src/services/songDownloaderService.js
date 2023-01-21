import { songDownloaderApi } from "../api/songDownloaderApi";
import { blobToArrayBuffer } from "../utils/blob";
import { createTrack } from "../utils/tracks";

const extractMetadata = (res) => {
	console.log(res.headers);
	const title = res.headers["x-title"];
	const artist = res.headers["x-artist"];
	const duration = res.headers["x-duration"];
	const youtubeId = res.headers["x-youtube-id"];
	const fileName = res.headers["x-file-name"];

	return { title, artist, duration, youtubeId, fileName };
};

const createAudioFile = async (res) => {
	// store the audio file as an arrayBuffer
	console.log(typeof res.data);

	const arrayBuffer = await blobToArrayBuffer(res.data);

	return {
		data: arrayBuffer,
		type: res.headers["content-type"],
	};
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
		audioFile: await createAudioFile(response),
	});
};

const downloadFromSpotifyTrackId = async (trackId) => {
	const response = await songDownloaderApi.get("/download/from-spotify-id", {
		params: {
			id: trackId,
		},
		headers: {
			"x-youtube-api-key": process.env.REACT_APP_YOUTUBE_API_KEY,
		},
		responseType: "blob",
	});

	const metadata = extractMetadata(response);

	return createTrack({
		...metadata,
		spotifyId: trackId,
		audioFile: await createAudioFile(response),
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
		responseType: "blob",
	});

	const metadata = extractMetadata(response);

	return createTrack({
		...metadata,
		audioFile: await createAudioFile(response),
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
