import { Avatar, Card } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import Routes from "../../routes/routes";
import { replacePathVariables } from "../../utils/router";

const SpotifyPlaylistCard = ({ playlist, className = "" }) => {
	const navigate = useNavigate();

	return (
		<Card
			hoverable
			className={`${className}`}
			bodyStyle={{
				padding: "1rem",
			}}
			onClick={() => {
				navigate(
					replacePathVariables(Routes.SpotifyPlaylistViewer, {
						playlistId: playlist.id,
					})
				);
			}}
		>
			<Card.Meta
				title={playlist.name}
				avatar={
					<Avatar src={playlist.images[0]?.url} size="large" shape="square" />
				}
			/>
		</Card>
	);
};

export default SpotifyPlaylistCard;
