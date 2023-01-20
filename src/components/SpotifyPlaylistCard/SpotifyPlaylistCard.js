import { Avatar, Card } from "antd";
import React from "react";

const SpotifyPlaylistCard = ({ playlist, className = "" }) => {
	return (
		<Card
			hoverable
			className={`${className}`}
			bodyStyle={{
				padding: "1rem",
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
