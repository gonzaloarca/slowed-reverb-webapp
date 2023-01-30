import Routes from "../../routes/routes";

const LibraryTabOptions = {
	Spotify: {
		value: "spotify",
		label: "Spotify Playlists",
		route: Routes.SpotifyPlaylists,
	},
	Local: {
		value: "local",
		label: "Local",
		route: Routes.LocalSongs,
	},
};

export default LibraryTabOptions;
