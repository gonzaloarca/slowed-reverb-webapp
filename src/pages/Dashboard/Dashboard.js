import React from "react";

const Dashboard = () => {
	return (
		<div>
			Dashboard
			{/* <Form
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
			</Form> */}
		</div>
	);
};

export default Dashboard;
