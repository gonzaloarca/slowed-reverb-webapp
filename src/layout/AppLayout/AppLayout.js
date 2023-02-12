import { Layout } from "antd";
import React, { Suspense, useContext } from "react";
import { Outlet } from "react-router-dom";
import Player from "../../components/Player";
import SplashScreen from "../../pages/SplashScreen/SplashScreen";
import BottomNav from "../BottomNav";
import { PlayerContext } from "../../context/PlayerContextProvider";
import TopNav from "../TopNav";

const { Header, Footer, Content } = Layout;

const AppLayout = () => {
	const { createToneContext } = useContext(PlayerContext);

	return (
		<Layout className="h-screen" onClick={createToneContext}>
			<Header
				style={{
					paddingInline: "1rem",
				}}
			>
				<TopNav />
			</Header>
			<Content
				style={{
					overflowY: "auto",
				}}
				id="layout-content"
			>
				<Suspense fallback={<SplashScreen />}>
					<Outlet />
				</Suspense>
			</Content>
			<Footer>
				<Player />
				<BottomNav />
			</Footer>
		</Layout>
	);
};

export default AppLayout;
