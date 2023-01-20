import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../../layout/AppLayout/AppLayout";
import SpotifyAuthSuccess from "../../pages/SpotifyAuthSuccess";
import Routes from "../routes";

const Dashboard = lazy(() => import("../../pages/Dashboard"));
// const Playlist = lazy(() => import("../../pages/Playlist"));
// const Search = lazy(() => import("../../pages/Search"));
const Library = lazy(() => import("../../pages/Library"));
// const SpotifyAuthSuccess = lazy(() => import("../../pages/SpotifyAuthSuccess"));

const AppRouter = createBrowserRouter([
	{
		path: Routes.Root,
		element: <AppLayout />,
		children: [
			{
				path: Routes.Dashboard,
				element: <Dashboard />,
			},
			// {
			//     path: Routes.Playlist,
			//     element: <Playlist />
			// },
			// {
			//     path: Routes.Search,
			//     element: <Search />
			// },
			{
				path: Routes.Library,
				element: <Library />,
			},
			// {
			//     path: Routes.Settings,
			//     element: <Settings />
			// }
			{
				path: Routes.SpotifyAuthSuccess,
				element: <SpotifyAuthSuccess />,
			},
		],
	},
]);

export default AppRouter;