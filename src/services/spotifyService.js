import SpotifyApi from "../api/spotifyApi";

const setAccessToken = (credentials) => {
	try {
		SpotifyApi.setAccessToken(credentials.accessToken);
	} catch (error) {
		console.log(error);
	}
};

const getCredentials = async (code) => {
	const { access_token, expires_in, refresh_token } = (
		await SpotifyApi.authorizationCodeGrant(code)
	).body;

	const expiresAt = new Date().getTime() + expires_in * 1000;

	console.log(expiresAt);

	return {
		accessToken: access_token,
		expiresAt,
		refreshToken: refresh_token,
	};
};

const fetchUserPlaylists = async (credentials) => {
	await setAccessToken(credentials);

	const userPlaylistsRes = await SpotifyApi.getUserPlaylists();
	console.log(userPlaylistsRes);

	return userPlaylistsRes.body.items;
};

const SpotifyService = {
	fetchUserPlaylists,
	getCredentials,
};

export default SpotifyService;
