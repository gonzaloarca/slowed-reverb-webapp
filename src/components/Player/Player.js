import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button, Col, Row, Slider } from "antd";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";
import style from "./Player.module.scss";
import { BsShuffle } from "react-icons/bs";
import LoadingSpinner from "../LoadingSpinner";
import RCSlider from "rc-slider";
import "rc-slider/assets/index.css";

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
		handleTrackEnd,
		handleTimeUpdate,
		handleMetadataLoaded,
	} = React.useContext(PlayerContext);
	const [isDragging, setIsDragging] = React.useState(false);

	const audioRef = React.useRef(null);

	const timeUpdateHandler = (e) => {
		if (isDragging) return;

		const current = e.target.currentTime;

		handleTimeUpdate(current);
	};

	const endedHandler = () => {
		handleTrackEnd();
	};

	const loadedHandler = (e) => {
		handleMetadataLoaded(e);
	};

	const handleDragChange = useCallback(
		(value) => {
			if (isDragging) {
				handleTimeUpdate(value);
			}
		},
		[isDragging]
	);

	const handleDragStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleDragEnd = useCallback((value) => {
		setIsDragging(false);

		if (audioRef.current) {
			audioRef.current.currentTime = value;
			handleTimeUpdate(value);
		}
	}, []);

	useEffect(() => {
		// apply reverb
		if (reverbRef.current) {
			reverbRef.current.decay = reverbAmount;
		}
	}, [reverbAmount, reverbRef]);

	useEffect(() => {
		if (!audioRef.current) {
			return;
		}

		if (!player.currentAudioUrl) {
			audioRef.current.pause();
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

					<div className={style.progressContainer}>
						<RCSlider
							value={player?.currentTime}
							max={player?.duration}
							onChange={handleDragChange}
							onBeforeChange={handleDragStart}
							onAfterChange={handleDragEnd}
						/>
					</div>
				</div>

				<Button
					type="text"
					shape="circle"
					onClick={toggleShuffle}
					size="large"
					className="flex justify-center items-center"
				>
					<BsShuffle
						color={player.shuffle ? "green" : "white"}
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
			<audio
				src={player.currentAudioUrl}
				ref={audioRef}
				onLoadedMetadata={loadedHandler}
				onTimeUpdate={timeUpdateHandler}
				onEnded={endedHandler}
			/>
		</>
	);
};

export default Player;
