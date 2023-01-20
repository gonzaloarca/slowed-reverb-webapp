import SpotifyApi from "../api/spotifyApi";
import { translateSpotifyApiPlaylistToLocal } from "../utils/spotify";

const _setAccessToken = (credentials) => {
	try {
		SpotifyApi.setAccessToken(credentials.accessToken);
	} catch (error) {
		console.log(error);
	}
};

const getCredentials = async (code) => {
	const { access_token, expires_in, refresh_token } = (
		await SpotifyApi.authorizationCodeGrant(code)
	).body;

	const expiresAt = new Date().getTime() + expires_in * 1000;

	console.log(expiresAt);

	return {
		accessToken: access_token,
		expiresAt,
		refreshToken: refresh_token,
	};
};

const fetchUserPlaylists = async (credentials, offset = null, limit = null) => {
	await _setAccessToken(credentials);
	let paginationOptions = offset && limit ? { offset, limit } : undefined;

	const userPlaylistsRes = await SpotifyApi.getUserPlaylists(paginationOptions);
	console.log(userPlaylistsRes);

	const userPlaylistsById = userPlaylistsRes.body.items
		.map((playlist) => translateSpotifyApiPlaylistToLocal(playlist))
		.reduce((acc, playlist) => {
			acc[playlist.id] = playlist;
			return acc;
		}, {});

	// parse next offset and limit from next URL's query params
	let nextOffset = null;
	let nextLimit = null;

	if (userPlaylistsRes.body.next) {
		const nextUrl = new URL(userPlaylistsRes.body.next);
		const nextOffsetParam = nextUrl.searchParams.get("offset");
		const nextLimitParam = nextUrl.searchParams.get("limit");

		nextOffset = nextOffsetParam ? parseInt(nextOffsetParam) : null;
		nextLimit = nextLimitParam ? parseInt(nextLimitParam) : null;
	}

	return {
		playlists: userPlaylistsById,
		fetchNext:
			nextOffset && nextLimit
				? (_credentials) =>
						fetchUserPlaylists(_credentials, nextOffset, nextLimit)
				: null,
	};
};

const fetchPlaylistItems = async (
	credentials,
	playlistId,
	offset = null,
	limit = null
) => {
	await _setAccessToken(credentials);

	let paginationOptions = offset && limit ? { offset, limit } : undefined;

	const playlistItemsRes = await SpotifyApi.getPlaylistTracks(
		playlistId,
		paginationOptions
	);

	console.log(playlistItemsRes);

	// parse next offset and limit from next URL's query params
	let nextOffset = null;
	let nextLimit = null;

	if (playlistItemsRes.body.next) {
		const nextUrl = new URL(playlistItemsRes.body.next);
		const nextOffsetParam = nextUrl.searchParams.get("offset");
		const nextLimitParam = nextUrl.searchParams.get("limit");

		nextOffset = nextOffsetParam ? parseInt(nextOffsetParam) : null;
		nextLimit = nextLimitParam ? parseInt(nextLimitParam) : null;
	}

	return {
		playlistItems: playlistItemsRes.body.items,
		fetchNext:
			nextOffset && nextLimit
				? (_credentials) =>
						fetchPlaylistItems(_credentials, playlistId, nextOffset, nextLimit)
				: null,
	};
};

const SpotifyService = {
	fetchUserPlaylists,
	getCredentials,
	fetchPlaylistItems,
};

export default SpotifyService;
