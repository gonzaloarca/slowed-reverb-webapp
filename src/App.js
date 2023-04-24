import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import "antd/dist/reset.css";
import TracksContextProvider from "./context/TracksContextProvider";
import TrackListContextProvider from "./context/TrackListContextProvider";
import PlayerContextProvider from "./context/PlayerContextProvider";
import PlaylistsContextProvider from "./context/PlaylistsContextProvider";
import AuthContextProvider from "./context/AuthContextProvider";
import { ConfigProvider, theme } from "antd";
import { Analytics } from "@vercel/analytics/react";
function App() {
	return (
		<>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<AuthContextProvider>
					<PlaylistsContextProvider>
						<TracksContextProvider>
							<TrackListContextProvider>
								<PlayerContextProvider>
									<RouterProvider router={AppRouter} />
								</PlayerContextProvider>
							</TrackListContextProvider>
						</TracksContextProvider>
					</PlaylistsContextProvider>
				</AuthContextProvider>
			</ConfigProvider>
			<Analytics />
		</>
	);
}

export default App;
