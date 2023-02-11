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
import { BsShuffle } from "react-icons/bs";
import LoadingSpinner from "../LoadingSpinner";

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
		reverbRef,
		toggleShuffle,
		isLoading,
	} = React.useContext(PlayerContext);
	const audioRef = React.useRef(null);

	useEffect(() => {
		// apply reverb
		if (reverbRef.current) {
			reverbRef.current.decay = reverbAmount;
		}
	}, [reverbAmount, reverbRef]);

	useEffect(() => {
		if (!audioRef.current || !player.currentAudioUrl) {
			return;
		}

		if (player.isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [player.isPlaying, player.currentAudioUrl]);

	return (
		<>
			<div className={style.playerContainer}>
				<div>
					{player.currentTrackId && (
						<div className={style.trackInfo}>
							Duration: {Math.floor(player.duration)}
							Current Time: {Math.floor(player.currentTime)}
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
						disabled={!player.currentTrackId || isLoading}
						onClick={() => {
							if (player.isPlaying) {
								pausePlayer();
							} else {
								resumePlayer();
							}
						}}
					>
						{player.isLoading ? (
							<LoadingSpinner />
						) : player.isPlaying ? (
							<PauseCircleFilled />
						) : (
							<PlayCircleFilled />
						)}
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

				<Button
					type="text"
					shape="circle"
					onClick={toggleShuffle}
					size="large"
					className="flex justify-center align-center"
				>
					<BsShuffle
						color={player.shuffle ? "green" : "black"}
						size="1.25rem"
					/>
				</Button>

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
			<audio src={player.currentAudioUrl} ref={audioRef} />
		</>
	);
};

export default Player;
