import { Button, Form, Input, InputNumber } from "antd";
import React from "react";
import * as Tone from "tone";
import { SongDownloaderService } from "../../services/songDownloaderService";

const Dashboard = () => {
	const handleSubmit = async (values) => {
		console.log(values);

		const track = await SongDownloaderService.downloadFromArtistAndTitle(
			values.artist,
			values.title
		);

		const data = track.audioFile.blob;

		const blobUrl = URL.createObjectURL(data);

		// console.log(data);

		const buffer = new Tone.Buffer(blobUrl, () => {
			console.log("buffer loaded");
			const buff = buffer.get();

			const { slowedAmount, reverbAmount } = values;
			const player = new Tone.Player(buff).toDestination();

			// apply playback rate
			player.playbackRate = 1 - slowedAmount;

			// apply reverb
			const reverb = new Tone.Reverb({
				wet: parseFloat(reverbAmount),
				decay: 4,
				preDelay: 0.01,
			}).toDestination();

			player.connect(reverb);

			player.start();
		});
	};

	return (
		<div>
			Dashboard
			<Form
				onFinish={handleSubmit}
				initialValues={{
					title: "",
					artist: "",
					slowedAmount: 0.5,
					reverbAmount: 0.5,
				}}
			>
				<Form.Item
					name="title"
					label="Title"
					rules={[
						{
							required: true,
							message: "Please input your title!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="artist"
					label="Artist"
					rules={[
						{
							required: true,
							message: "Please input your artist!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="slowedAmount"
					label="Slowed Amount"
					rules={[
						{
							required: true,
							message: "Please input your slowed!",
						},
						{
							type: "number",
							min: 0,
							max: 1,
							message: "Please input a number between 0 and 1",
						},
					]}
				>
					<InputNumber step={0.1} />
				</Form.Item>

				<Form.Item
					name="reverbAmount"
					label="Reverb Amount"
					rules={[
						{
							required: true,
							message: "Please input your reverb!",
						},
						{
							type: "number",
							min: 0,
							max: 1,
							message: "Please input a number between 0 and 1",
						},
					]}
				>
					<InputNumber step={0.1} />
				</Form.Item>

				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
};

export default Dashboard;
