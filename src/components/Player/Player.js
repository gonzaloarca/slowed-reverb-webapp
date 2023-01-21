import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button, Col, Row, Slider } from "antd";
import clsx from "clsx";
import React, { useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";
import style from "./Player.module.scss";

const Player = () => {
	const {
		player,
		resumePlayer,
		pausePlayer,
		skipToNextTrack,
		skipToPreviousTrack,
		slowedAmount,
		reverbAmount,
		setSlowedAmount,
		setReverbAmount,
		toneRef,
		reverbRef,
	} = React.useContext(PlayerContext);

	useEffect(() => {
		// apply playback rate
		if (toneRef.current) {
			toneRef.current.playbackRate = 1 - slowedAmount;
		}
	}, [slowedAmount, toneRef]);

	useEffect(() => {
		// apply reverb
		if (reverbRef.current) {
			reverbRef.current.decay = reverbAmount;
		}
	}, [reverbAmount, reverbRef]);

	return (
		<div className={style.playerContainer}>
			<div>
				{player.currentTrackId && (
					<div className={style.trackInfo}>
						Duration: {player.duration}
						Current Time: {player.currentTime}
					</div>
				)}
			</div>
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

			<Row className={style.controlsContainer}>
				<Col span={4}>Slowed</Col>
				<Col span={20}>
					<Slider
						min={0}
						max={1}
						onChange={(value) => {
							setSlowedAmount(value);
						}}
						value={slowedAmount}
						step={0.05}
					/>
				</Col>
				<Col span={4}>Reverb</Col>
				<Col span={20}>
					<Slider
						min={0.01}
						max={5}
						onChange={(value) => {
							setReverbAmount(value);
						}}
						value={reverbAmount}
						step={0.05}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Player;
