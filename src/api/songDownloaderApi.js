import axios from "axios";

export const songDownloaderApi = axios.create({
	baseURL: process.env.REACT_APP_SONG_DOWNLOADER_API,
});

// songDownloaderApi.interceptors.request.use(config => {
// 	const { userId, userToken } = store.getState().auth;

// 	if (userId && userToken) {
// 		config.headers['publisher-user-id'] = userId;
// 		config.headers['publisher-user-token'] = userToken;
// 	}

// 	return config;
// });
