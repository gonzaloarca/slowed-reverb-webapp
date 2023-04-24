import { SettingFilled } from "@ant-design/icons";
import { Button, Col, Modal, Row, Slider } from "antd";
import React from "react";
import { PlayerContext } from "../../context/PlayerContextProvider";

const TopNav = () => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const { slowedAmount, reverbAmount, setSlowedAmount, setReverbAmount } =
		React.useContext(PlayerContext);

	return (
		<>
			<div className="flex justify-between items-center">
				<div className="flex">
					<h1
						className="mb-0 mr-2"
						style={{
							fontSize: "1.2rem",
						}}
					>
						Slow + Reverb
					</h1>
					<span>v{process.env.REACT_APP_VERSION}</span>
				</div>

				<Button
					type="text"
					shape="circle"
					onClick={() => setIsModalOpen(true)}
					size="large"
					className="flex justify-center items-center"
				>
					<SettingFilled
						style={{
							fontSize: "1.25rem",
						}}
					/>
				</Button>
			</div>
			<Modal
				title="Effects Settings"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				closable
			>
				<Row>
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
			</Modal>
		</>
	);
};

export default TopNav;
