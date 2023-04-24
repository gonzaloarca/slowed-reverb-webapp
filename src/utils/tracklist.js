export const createTrack = (spotifyTrack) => ({
	id: spotifyTrack.track.id,
	metadata: {
		title: spotifyTrack?.track?.name,
		artist: spotifyTrack?.track?.artists?.[0]?.name,
		album: spotifyTrack?.track?.album?.name,
		images: spotifyTrack?.track?.album?.images?.map((image) => ({
			src: image.url,
			sizes: `${image.width}x${image.height}`,
			type: "image/jpeg",
		})),
	},
});
