import React from "react";
import { SongDownloaderService } from "../services/songDownloaderService";

export const AuthContext = React.createContext(null);

const SPOTIFY_CREDENTIALS_KEY = "spotifyCredentials";

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
			localStorage.setItem(
				SPOTIFY_CREDENTIALS_KEY,
				JSON.stringify(credentials)
			);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const setSpotifyCredentialsFromLocalStorage = async () => {
		setIsLoading(true);
		try {
			const cachedCredentialsStr = localStorage.getItem(
				SPOTIFY_CREDENTIALS_KEY
			);

			if (cachedCredentialsStr) {
				const cachedCredentials = JSON.parse(cachedCredentialsStr);
				console.log("using cached credentials", cachedCredentials);

				const now = new Date();
				if (now < new Date(cachedCredentials.expiresAt)) {
					console.log("not expired");

					setSpotifyCredentials(cachedCredentials);
					setIsLoading(false);
				} else {
					console.log("expired");

					// refresh credentials
					const { accessToken, expiresAt } =
						await SongDownloaderService.refreshSpotifyCredentials(
							cachedCredentials.refreshToken
						);

					const credentials = {
						accessToken,
						refreshToken: cachedCredentials.refreshToken,
						expiresAt,
					};

					setSpotifyCredentials(credentials);

					// set local storage
					localStorage.setItem(
						SPOTIFY_CREDENTIALS_KEY,
						JSON.stringify(credentials)
					);
				}
			}
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		setSpotifyCredentialsFromLocalStorage();
	}, []);

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
