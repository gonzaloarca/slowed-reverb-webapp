import { camelize } from "./format";

export const translateSpotifyApiPlaylistToLocal = (apiPlaylist) =>
	camelize(apiPlaylist);
