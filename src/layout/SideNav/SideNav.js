import { Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Routes from "../../routes";
import { BiLibrary } from "react-icons/bi";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import styles from "./SideNav.module.scss";

const SideNav = () => {
	return (
		<Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} theme="dark">
			<Menu.Item key="1">
				<div className={styles.menuItemContent}>
					<AiFillHome className="mr-2" />
					<span>Home</span>
				</div>
				<Link to={Routes.Dashboard} />
			</Menu.Item>

			<Menu.Item key="2">
				<div className={styles.menuItemContent}>
					<BiLibrary className="mr-2" />
					<span>Library</span>
				</div>
				<Link to={Routes.Library} />
			</Menu.Item>

			<Menu.Item key="3">
				<div className={styles.menuItemContent}>
					<AiOutlineSearch className="mr-2" />
					<span>Search</span>
				</div>
				<Link to={Routes.Search} />
			</Menu.Item>
		</Menu>
	);
};

export default SideNav;
