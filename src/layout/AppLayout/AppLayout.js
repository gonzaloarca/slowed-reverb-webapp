import { Layout } from "antd";
import React, { Suspense, useContext } from "react";
import { Outlet } from "react-router-dom";
import Player from "../../components/Player";
import SplashScreen from "../../pages/SplashScreen/SplashScreen";
import BottomNav from "../BottomNav";
import { PlayerContext } from "../../context/PlayerContextProvider";
import TopNav from "../TopNav";
import style from "./AppLayout.module.scss";

const { Header, Footer, Content } = Layout;

const AppLayout = () => {
	const { createToneContext } = useContext(PlayerContext);

	return (
		<Layout className={style.layout} onClick={createToneContext}>
			<Header
				className={style.header}
				style={{
					paddingInline: "1rem",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
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
			<Footer className={style.bottom}>
				<Player />
				<BottomNav />
			</Footer>
		</Layout>
	);
};

export default AppLayout;
