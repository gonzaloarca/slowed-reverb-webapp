import React from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/AuthContextProvider";
import Routes from "../../routes/routes";

const SpotifyAuthSuccess = () => {
	const [searchParams] = useSearchParams();
	const spotifyCode = searchParams.get("code");
	const spotifyState = searchParams.get("state");
	const { spotifyCredentials, getSpotifyCredentials, isLoading } =
		React.useContext(AuthContext);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!spotifyCode || spotifyCredentials?.accessToken || isLoading) {
			return;
		}

		getSpotifyCredentials(spotifyCode, spotifyState).then(() => {
			navigate(Routes.Library);
		});
	}, [
		spotifyCode,
		getSpotifyCredentials,
		spotifyCredentials,
		isLoading,
		navigate,
		spotifyState,
	]);

	return (
		<div>
			Loading
			<LoadingSpinner />
		</div>
	);
};

export default SpotifyAuthSuccess;
