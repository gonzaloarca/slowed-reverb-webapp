import { Button, Form, Input } from "antd";
import React from "react";
import * as Tone from "tone";
import { SongDownloaderService } from "../../services/songDownloaderService";

const Dashboard = () => {
	const handleSubmit = async (values) => {
		console.log(values);

		const data = await SongDownloaderService.downloadFromArtistAndTitle(
			values.artist,
			values.title
		);

		const blobUrl = URL.createObjectURL(data);

		// console.log(data);

		const buffer = new Tone.Buffer(blobUrl, () => {
			console.log("buffer loaded");
			const buff = buffer.get();

			const { slowedAmount, reverbAmount } = values;
			const player = new Tone.Player(buff).toDestination();

			// apply playback rate
			player.playbackRate = slowedAmount;

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
					slowedAmount: -12,
					reverbAmount: 2,
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
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="reverbAmount"
					label="Reverb Amount"
					rules={[
						{
							required: true,
							message: "Please input your reverb!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
};

export default Dashboard;
