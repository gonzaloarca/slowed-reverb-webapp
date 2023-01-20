import React from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
			navigate("/library");
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
			<Spin indicator={antIcon} />
		</div>
	);
};

export default SpotifyAuthSuccess;
