import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button } from "antd";
import clsx from "clsx";
import React from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";
import style from "./Player.module.scss";

const Player = () => {
	const {
		player,
		playTrack,
		resumePlayer,
		pausePlayer,
		skipToNextTrack,
		skipToPreviousTrack,
		seekTo,
	} = React.useContext(PlayerContext);

	return (
		<div className={style.playerContainer}>
			<div className={style.playerButtons}>
				<Button
					type="text"
					shape="circle"
					onClick={skipToPreviousTrack}
					size="large"
				>
					<StepBackwardFilled />
				</Button>
				<Button
					size="large"
					className={clsx(style.playButton, "mx-2")}
					type="text"
					shape="circle"
					onClick={() => {
						if (player.isPlaying) {
							pausePlayer();
						} else {
							resumePlayer();
						}
					}}
				>
					{player.isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
				</Button>
				<Button
					type="text"
					shape="circle"
					onClick={skipToNextTrack}
					size="large"
				>
					<StepForwardFilled />
				</Button>
			</div>
		</div>
	);
};

export default Player;
