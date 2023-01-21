import { Layout } from "antd";
import React, { Suspense, useContext } from "react";
import { Outlet } from "react-router-dom";
import Player from "../../components/Player";
import SplashScreen from "../../pages/SplashScreen/SplashScreen";
import BottomNav from "../BottomNav";
import SideNav from "../SideNav";
import { PlayerContext } from "../../context/PlayerContextProvider";

const { Header, Footer, Sider, Content } = Layout;

const AppLayout = () => {
	const { createToneContext } = useContext(PlayerContext);

	return (
		<Layout className="h-screen" onClick={createToneContext}>
			<Header>Header</Header>
			<Layout>
				<Sider
				// breakpoint="sm" collapsedWidth="0"
				>
					<SideNav />
				</Sider>
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
			</Layout>
			<Footer>
				<Player />
				<BottomNav />
			</Footer>
		</Layout>
	);
};

export default AppLayout;
