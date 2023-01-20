import React from "react";
import LibraryTabOptions from "../pages/Library/libraryTabOptions";
import SpotifyService from "../services/spotifyService";
import { AuthContext } from "./AuthContextProvider";

export const PlaylistsContext = React.createContext(null);

const PlaylistsContextProvider = ({ children }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [playlists, setPlaylists] = React.useState(
		Object.keys(LibraryTabOptions).reduce((acc, key) => {
			acc[LibraryTabOptions[key].value] = null;

			return acc;
		}, {})
	);
	const { spotifyCredentials } = React.useContext(AuthContext);

	const fetchSpotifyPlaylists = async () => {
		try {
			setIsLoading(true);
			const userPlaylists = await SpotifyService.fetchUserPlaylists(
				spotifyCredentials
			);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: userPlaylists,
			}));
		} catch (error) {
			console.log(error);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: [],
			}));
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
