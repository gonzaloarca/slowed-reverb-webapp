import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import "antd/dist/reset.css";
import TracksContextProvider from "./context/TracksContextProvider";
import TrackQueueContextProvider from "./context/TrackQueueContextProvider";
import TrackHistoryContextProvider from "./context/TrackHistoryContextProvider";
import PlayerContextProvider from "./context/PlayerContextProvider";
import PlaylistsContextProvider from "./context/PlaylistsContextProvider";

function App() {
	return (
		<PlaylistsContextProvider>
			<TracksContextProvider>
				<TrackQueueContextProvider>
					<TrackHistoryContextProvider>
						<PlayerContextProvider>
							<RouterProvider router={AppRouter} />;
						</PlayerContextProvider>
					</TrackHistoryContextProvider>
				</TrackQueueContextProvider>
			</TracksContextProvider>
		</PlaylistsContextProvider>
	);
}

export default App;
