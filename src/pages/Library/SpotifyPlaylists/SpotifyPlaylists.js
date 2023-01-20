import { Button, Spin } from "antd";
import React, { useMemo } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { PlaylistsContext } from "../../../context/PlaylistsContextProvider";
import LibraryTabOptions from "../libraryTabOptions";

const SpotifyPlaylists = () => {
	const { spotifyCredentials, isLoading: isAuthLoading } =
		React.useContext(AuthContext);
	const { playlists, fetchSpotifyPlaylists, isLoading } =
		React.useContext(PlaylistsContext);
	const spotifyPlaylists = useMemo(
		() => playlists?.[LibraryTabOptions.Spotify.value],
		[playlists]
	);

	React.useEffect(() => {
		console.log(playlists);

		if (!spotifyPlaylists && !isLoading && spotifyCredentials.accessToken) {
			fetchSpotifyPlaylists();
		}
	}, [
		spotifyPlaylists,
		isLoading,
		fetchSpotifyPlaylists,
		playlists,
		spotifyCredentials,
	]);

	return isAuthLoading ? (
		<Spin />
	) : !spotifyCredentials?.accessToken ? (
		<Button>
			<a href="http://localhost:8000/auth/spotify">Login with Spotify</a>
		</Button>
	) : (
		<div>
			{spotifyPlaylists?.map((playlist) => (
				<div key={playlist.id}>{JSON.stringify(playlist)}</div>
			))}
		</div>
	);
};

export default SpotifyPlaylists;
