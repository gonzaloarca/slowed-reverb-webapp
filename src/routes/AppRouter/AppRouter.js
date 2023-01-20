import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../../layout/AppLayout/AppLayout";
import Routes from "../routes";

const Dashboard = lazy(() => import("../../pages/Dashboard"));
// const Playlist = lazy(() => import("../../pages/Playlist"));
// const Search = lazy(() => import("../../pages/Search"));
const Library = lazy(() => import("../../pages/Library"));
const SpotifyAuthSuccess = lazy(() => import("../../pages/SpotifyAuthSuccess"));
const SpotifyPlaylistViewer = lazy(() =>
	import("../../pages/SpotifyPlaylistViewer")
);
const SpotifyPlaylists = lazy(() =>
	import("../../pages/Library/SpotifyPlaylists")
);

const AppRouter = createBrowserRouter([
	{
		path: Routes.Root,
		element: <AppLayout />,
		children: [
			{
				path: Routes.Dashboard,
				element: <Dashboard />,
			},
			{
				path: Routes.Library,
				element: <Library />,
				children: [
					{
						path: Routes.SpotifyPlaylists,
						element: <SpotifyPlaylists />,
					},
				],
			},
			{
				path: Routes.SpotifyAuthSuccess,
				element: <SpotifyAuthSuccess />,
			},
			{
				path: Routes.SpotifyPlaylistViewer,
				element: <SpotifyPlaylistViewer />,
			},
		],
	},
]);

export default AppRouter;
