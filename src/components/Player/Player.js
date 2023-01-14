import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button } from "antd";
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
			<Button
				shape="circle"
				icon={<StepBackwardFilled />}
				onClick={skipToPreviousTrack}
			/>
			<Button
				shape="circle"
				onClick={() => {
					if (player.isPlaying) {
						pausePlayer();
					} else {
						resumePlayer();
					}
				}}
				icon={player.isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
			/>
			<Button
				shape="circle"
				icon={<StepForwardFilled />}
				onClick={skipToNextTrack}
			/>
		</div>
	);
};

export default Player;
