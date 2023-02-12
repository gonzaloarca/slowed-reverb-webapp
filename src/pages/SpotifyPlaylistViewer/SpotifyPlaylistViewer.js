import { Breadcrumb, List } from "antd";
import clsx from "clsx";
import React, { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { PlayerContext } from "../../context/PlayerContextProvider";
import { PlaylistsContext } from "../../context/PlaylistsContextProvider";
import Routes from "../../routes/routes";
import LibraryTabOptions from "../Library/libraryTabOptions";
import style from "./SpotifyPlaylistViewer.module.scss";

const SpotifyPlaylistViewer = () => {
	const { playlistId } = useParams();
	const { playlists, fetchSpotifyPlaylistItems, isFetchingPlaylistItems } =
		React.useContext(PlaylistsContext);
	const {
		selectSpotifyTrack,
		selectSpotifyTrackFromPlaylist,
		player,
		isLoading,
	} = React.useContext(PlayerContext);

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
		<div className="w-100 h-100 flex items-center justify-center">
			<LoadingSpinner />
		</div>
	) : (
		<section className={clsx(style.container, "py-4 px-0")}>
			<Breadcrumb className="px-3">
				<Breadcrumb.Item>
					<Link to={Routes.Library}>Playlists</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{playlist?.name}</Breadcrumb.Item>
			</Breadcrumb>
			<List
				dataSource={playlist?.tracks?.items}
				renderItem={(item) => (
					<List.Item
						key={item.id}
						className={clsx(
							style.songItem,
							player.currentTrackId === item.track.id && style.activeSong
						)}
						onClick={() =>
							selectSpotifyTrackFromPlaylist(item.track.id, playlistId)
						}
					>
						<div className={style.songItemStatus}>
							{isLoading && player.currentTrackId === item.track.id ? (
								<LoadingSpinner size="small" fontSize={16} />
							) : (
								<></>
							)}
						</div>
						<List.Item.Meta
							title={item.track.name}
							description={item.track.artists
								.map((artist) => artist.name)
								.join(", ")}
						/>
					</List.Item>
				)}
			/>
		</section>
	);
};

export default SpotifyPlaylistViewer;
