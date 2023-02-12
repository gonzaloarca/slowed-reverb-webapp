import {
	PauseCircleFilled,
	PlayCircleFilled,
	StepBackwardFilled,
	StepForwardFilled,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";
import style from "./Player.module.scss";
import "./Slider.scss";
import { BsShuffle } from "react-icons/bs";
import LoadingSpinner from "../LoadingSpinner";
import RCSlider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatSeconds } from "../../utils/format";

const Player = () => {
	const {
		player,
		resumePlayer,
		pausePlayer,
		skipToNextTrack,
		skipToPreviousTrack,
		toggleShuffle,
		isLoading,
		handleTrackEnd,
		handleTimeUpdate,
		handleMetadataLoaded,
	} = React.useContext(PlayerContext);
	const [isDragging, setIsDragging] = React.useState(false);
	const [showErrorModal, setShowErrorModal] = React.useState(false);

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
		[isDragging, handleTimeUpdate]
	);

	const handleDragStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleDragEnd = useCallback(
		(value) => {
			setIsDragging(false);

			if (audioRef.current) {
				audioRef.current.currentTime = value;
				handleTimeUpdate(value);
			}
		},
		[handleTimeUpdate]
	);

	useEffect(() => {
		console.log("EFFECT");
		if (!audioRef.current) {
			return;
		}

		if (!player.currentAudioUrl) {
			audioRef.current.pause();
			return;
		}

		if (player.isPlaying && audioRef.current.paused) {
			audioRef.current.play().catch((err) => {
				console.error(err);
				setShowErrorModal(true);
				pausePlayer();
			});
		} else if (!player.isPlaying && !audioRef.current.paused) {
			audioRef.current.pause();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.isPlaying, player.currentAudioUrl]);

	return (
		<>
			<div className={style.playerContainer}>
				<div>
					<div className={style.playerButtons}>
						<Button
							type="text"
							shape="circle"
							size="large"
							disabled
							className="cursor-default"
						></Button>
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

						<Button
							type="text"
							shape="circle"
							onClick={toggleShuffle}
							size="large"
							className="flex justify-center items-center ml-2"
						>
							<BsShuffle
								color={player.shuffle ? "lightgreen" : "white"}
								size="1.25rem"
							/>
						</Button>
					</div>

					<div className={style.progressContainer}>
						{formatSeconds(player?.currentTime)}
						<RCSlider
							value={player?.currentTime}
							max={player?.duration}
							onChange={handleDragChange}
							onBeforeChange={handleDragStart}
							onAfterChange={handleDragEnd}
							disabled={!player.currentTrackId || isLoading}
						/>
						{formatSeconds(player?.duration)}
					</div>
				</div>
			</div>
			<audio
				src={player.currentAudioUrl}
				ref={audioRef}
				onLoadedMetadata={loadedHandler}
				onTimeUpdate={timeUpdateHandler}
				onEnded={endedHandler}
				onPlay={() => {
					resumePlayer();
				}}
				onPause={() => {
					pausePlayer();
				}}
				autoPlay
			/>
			<Modal
				title="Playback Error"
				open={showErrorModal}
				onCancel={() => setShowErrorModal(false)}
				footer={null}
			>
				<p>There was an error playing the track. Please try again</p>
			</Modal>
		</>
	);
};

export default Player;
