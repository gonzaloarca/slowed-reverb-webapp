import React, { useMemo } from "react";
import { PlaylistsContext } from "../../../context/PlaylistsContextProvider";
import LibraryTabOptions from "../libraryTabOptions";

const SpotifyPlaylists = () => {
	const { playlists, fetchSpotifyPlaylists, isLoading } =
		React.useContext(PlaylistsContext);
	const spotifyPlaylists = useMemo(
		() => playlists?.[LibraryTabOptions.Spotify.value],
		[playlists]
	);

	React.useEffect(() => {
		console.log(playlists);

		if (!spotifyPlaylists && !isLoading) {
			fetchSpotifyPlaylists();
		}
	}, [spotifyPlaylists, isLoading, fetchSpotifyPlaylists, playlists]);

	return (
		<div>
			{spotifyPlaylists?.map((playlist) => (
				<div key={playlist.id}>{JSON.stringify(playlist)}</div>
			))}
		</div>
	);
};

export default SpotifyPlaylists;
