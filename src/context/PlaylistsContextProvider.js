import React from "react";
import LibraryTabOptions from "../pages/Library/libraryTabOptions";
import SpotifyService from "../services/spotifyService";
import { AuthContext } from "./AuthContextProvider";

export const PlaylistsContext = React.createContext(null);

const PlaylistsContextProvider = ({ children }) => {
	const [isFetchingPlaylists, setIsFetchingPlaylists] = React.useState(false);
	const [isFetchingPlaylistItems, setIsFetchingPlaylistItems] =
		React.useState(false);
	const [playlists, setPlaylists] = React.useState(
		Object.keys(LibraryTabOptions).reduce((acc, key) => {
			acc[LibraryTabOptions[key].value] = null;

			return acc;
		}, {})
	);
	const [fetchNextSpotifyPlaylists, setFetchNextSpotifyPlaylists] =
		React.useState(null);
	const { spotifyCredentials } = React.useContext(AuthContext);

	const fetchSpotifyPlaylists = async () => {
		try {
			setIsFetchingPlaylists(true);
			const fetchPlaylists =
				fetchNextSpotifyPlaylists || SpotifyService.fetchUserPlaylists;

			const { playlists: newPlaylists, fetchNext } = await fetchPlaylists(
				spotifyCredentials
			);

			setFetchNextSpotifyPlaylists(() => fetchNext);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: {
					...(prevPlaylists[LibraryTabOptions.Spotify.value] || {}),
					...newPlaylists,
				},
			}));
		} catch (error) {
			console.log(error);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: {
					...(prevPlaylists[LibraryTabOptions.Spotify.value] || {}),
				},
			}));
		} finally {
			setIsFetchingPlaylists(false);
		}
	};

	const fetchSpotifyPlaylistItems = async (playlistId) => {
		try {
			const playlist = playlists[LibraryTabOptions.Spotify.value]?.[playlistId];

			if (!playlist?.tracks?.items) {
				// should only be true on first fetch
				setIsFetchingPlaylistItems(true);
			}

			const { playlistItems: newPlaylistItems } =
				await SpotifyService.fetchPlaylistItems(spotifyCredentials, playlistId);

			setPlaylists({
				...playlists,
				[LibraryTabOptions.Spotify.value]: {
					...(playlists[LibraryTabOptions.Spotify.value] || {}),
					[playlistId]: {
						...(playlist || {}),
						tracks: {
							items: [...(playlist?.tracks?.items || []), ...newPlaylistItems],
						},
					},
				},
			});
		} catch (error) {
			console.log(error);

			setPlaylists((prevPlaylists) => ({
				...prevPlaylists,
				[LibraryTabOptions.Spotify.value]: {
					...(prevPlaylists[LibraryTabOptions.Spotify.value] || {}),
					[playlistId]: {
						...(prevPlaylists[LibraryTabOptions.Spotify.value]?.[playlistId] ||
							{}),
						tracks: {
							items: [
								...(prevPlaylists[LibraryTabOptions.Spotify.value]?.[playlistId]
									?.tracks?.items || []),
							],
						},
					},
				},
			}));
		} finally {
			setIsFetchingPlaylistItems(false);
		}
	};

	return (
		<PlaylistsContext.Provider
			value={{
				playlists,
				fetchSpotifyPlaylists,
				fetchSpotifyPlaylistItems,
				isFetchingPlaylists,
				isFetchingPlaylistItems,
				hasMorePlaylists: !!fetchNextSpotifyPlaylists,
			}}
		>
			{children}
		</PlaylistsContext.Provider>
	);
};

export default PlaylistsContextProvider;
