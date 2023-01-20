import { Breadcrumb, List } from "antd";
import React, { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { PlaylistsContext } from "../../context/PlaylistsContextProvider";
import Routes from "../../routes/routes";
import LibraryTabOptions from "../Library/libraryTabOptions";

const SpotifyPlaylistViewer = () => {
	const { playlistId } = useParams();
	const { playlists, fetchSpotifyPlaylistItems, isFetchingPlaylistItems } =
		React.useContext(PlaylistsContext);

	const playlist = useMemo(
		() => playlists[LibraryTabOptions.Spotify.value]?.[playlistId],
		[playlistId, playlists]
	);

	React.useEffect(() => {
		if ((!playlist || !playlist.tracks?.items) && !isFetchingPlaylistItems) {
			fetchSpotifyPlaylistItems(playlistId);
		}
	}, [
		playlistId,
		playlist,
		isFetchingPlaylistItems,
		fetchSpotifyPlaylistItems,
	]);

	return isFetchingPlaylistItems ? (
		<LoadingSpinner />
	) : (
		<div>
			<Breadcrumb>
				<Breadcrumb.Item>
					<Link to={Routes.Library}>Library</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to={Routes.SpotifyPlaylists}>Spotify Playlists</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{playlist?.name}</Breadcrumb.Item>
			</Breadcrumb>
			<InfiniteScroll
				dataLength={playlist?.tracks?.items?.length || 0}
				next={() => fetchSpotifyPlaylistItems(playlistId)}
				hasMore={!!playlist?.fetchNext}
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
				scrollableTarget="layout-content"
			>
				<List
					dataSource={playlist?.tracks?.items}
					renderItem={(item) => (
						<List.Item key={item.id}>
							<List.Item.Meta
								title={item.track.name}
								description={item.track.artists
									.map((artist) => artist.name)
									.join(", ")}
							/>
						</List.Item>
					)}
				/>
			</InfiniteScroll>
		</div>
	);
};

export default SpotifyPlaylistViewer;
