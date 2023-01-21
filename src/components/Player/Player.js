import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button } from "antd";
import clsx from "clsx";
import React, { useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";
import style from "./Player.module.scss";
import { db } from "../../utils/db";
import { arrayBufferToBlob } from "../../utils/blob";

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
	const [audioSrc, setAudioSrc] = React.useState("");
	const audioRef = React.useRef(null);

	useEffect(() => {
		(async () => {
			if (player.currentTrackId) {
				// get audioFile from indexedDB
				const track = await db.tracks.get(player.currentTrackId);

				console.log("track", track);

				// create a blob url from the audioFile, which contains arrayBuffer and type
				const blob = arrayBufferToBlob(
					track.audioFile.data,
					track.audioFile.type
				);

				console.log("file", blob);

				const url = URL.createObjectURL(blob);

				setAudioSrc(url);
			}
		})();
	}, [player.currentTrackId]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = player.currentTime;
		}

		if (player.isPlaying && audioSrc) {
			audioRef.current?.play();
		} else {
			audioRef.current?.pause();
		}
	}, [player, audioSrc]);

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

				<audio src={audioSrc} ref={audioRef} />
			</div>
		</div>
	);
};

export default Player;
