import { Radio } from "antd";
import React from "react";
import LibraryTabOptions from "./libraryTabOptions";
import SpotifyPlaylists from "./SpotifyPlaylists/SpotifyPlaylists";

const Library = () => {
	const [libraryTab, setLibraryTab] = React.useState(
		LibraryTabOptions.Spotify.value
	);

	return (
		<section>
			<h1>Library</h1>
			<div>
				<Radio.Group
					options={Object.values(LibraryTabOptions)}
					onChange={(e) => setLibraryTab(e.target.value)}
					value={libraryTab}
					optionType="button"
					buttonStyle="solid"
				/>

				{libraryTab === LibraryTabOptions.Spotify.value && <SpotifyPlaylists />}
			</div>
		</section>
	);
};

export default Library;
