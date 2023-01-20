import React from "react";
import SpotifyApi from "../api/spotifyApi";
import { SongDownloaderService } from "../services/songDownloaderService";

export const AuthContext = React.createContext(null);

const AuthContextProvider = ({ children }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [spotifyCredentials, setSpotifyCredentials] = React.useState({
		accessToken: "",
		refreshToken: "",
		expiresAt: null,
	});

	const getSpotifyCredentials = async (code, state) => {
		setIsLoading(true);

		try {
			const credentials = await SongDownloaderService.getSpotifyCredentials(
				code,
				state
			);

			console.log(credentials);

			setSpotifyCredentials(credentials);

			// set local storage
			localStorage.setItem("spotifyCredentials", JSON.stringify(credentials));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				spotifyCredentials,
				setSpotifyCredentials,
				isLoading,
				getSpotifyCredentials,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
