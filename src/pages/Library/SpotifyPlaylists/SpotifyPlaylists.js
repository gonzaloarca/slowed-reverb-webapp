import { Button, Spin } from "antd";
import React, { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SpotifyPlaylistCard from "../../../components/SpotifyPlaylistCard";
import { AuthContext } from "../../../context/AuthContextProvider";
import { PlaylistsContext } from "../../../context/PlaylistsContextProvider";
import LibraryTabOptions from "../libraryTabOptions";

const SpotifyPlaylists = () => {
	const { spotifyCredentials, isLoading: isAuthLoading } =
		React.useContext(AuthContext);
	const { playlists, fetchSpotifyPlaylists, isLoading, hasMore } =
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
		<InfiniteScroll
			dataLength={spotifyPlaylists?.length || 0}
			next={fetchSpotifyPlaylists}
			hasMore={hasMore}
			loader={
				<div
					className="flex justify-center align-center w-100"
					style={{
						height: "5vh",
					}}
				>
					<LoadingSpinner />
				</div>
			}
			scrollThreshold={0.95}
			scrollableTarget="layout-content"
		>
			{spotifyPlaylists?.map((playlist) => (
				<SpotifyPlaylistCard
					playlist={playlist}
					key={playlist?.id}
					className="mb-2"
				/>
			))}
		</InfiniteScroll>
	);
};

export default SpotifyPlaylists;
