import SpotifyWebApi from "spotify-web-api-node";

const SpotifyApi = new SpotifyWebApi({
	clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
	clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
});

export default SpotifyApi;
