import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LibraryTabOptions from "./libraryTabOptions";

const Library = () => {
	const [libraryTab, setLibraryTab] = React.useState(
		LibraryTabOptions.Spotify.value
	);

	const location = useLocation();
	const navigate = useNavigate();

	React.useEffect(() => {
		const pathTab = Object.values(LibraryTabOptions).find((tab) =>
			location.pathname.includes(tab.route)
		);

		if (!pathTab) {
			const tabRoute = Object.values(LibraryTabOptions).find(
				(tab) => tab.value === libraryTab
			)?.route;

			if (tabRoute) {
				navigate(tabRoute);
			}

			return;
		}

		setLibraryTab((prevTab) => {
			if (pathTab && pathTab.value !== prevTab) {
				return pathTab.value;
			}
			return prevTab;
		});
	}, [location.pathname, libraryTab, navigate]);

	return (
		<section className="p-4">
			<h1>Your Spotify Playlists</h1>
			<div>
				{/* <Radio.Group
					onChange={(e) => setLibraryTab(e.target.value)}
					value={libraryTab}
					optionType="button"
					buttonStyle="solid"
				>
					{Object.values(LibraryTabOptions).map((tab) => (
						<Link to={tab.route} key={tab.value}>
							<Radio.Button value={tab.value}>{tab.label}</Radio.Button>
						</Link>
					))}
				</Radio.Group> */}

				{/*  */}

				<Outlet />
			</div>
		</section>
	);
};

export default Library;
