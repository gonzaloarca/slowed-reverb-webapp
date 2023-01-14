import React from "react";
import SpotifyApi from "../api/spotifyApi";
import LibraryTabOptions from "../pages/Library/libraryTabOptions";

export const PlaylistsContext = React.createContext(null);

const PlaylistsContextProvider = ({ children }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [playlists, setPlaylists] = React.useState(
		Object.keys(LibraryTabOptions).reduce((acc, key) => {
			acc[LibraryTabOptions[key].value] = null;

			return acc;
		}, {})
	);

	const fetchSpotifyPlaylists = async () => {
		try {
			setIsLoading(true);
			const userPlaylistsRes = await SpotifyApi.getUserPlaylists();

			console.log(userPlaylistsRes.body.items);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: userPlaylistsRes.body.items,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PlaylistsContext.Provider
			value={{ playlists, fetchSpotifyPlaylists, isLoading }}
		>
			{children}
		</PlaylistsContext.Provider>
	);
};

export default PlaylistsContextProvider;
