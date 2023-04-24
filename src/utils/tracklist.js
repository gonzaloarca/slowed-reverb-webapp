export const createTrack = (spotifyTrack) => ({
	id: spotifyTrack.track.id,
	metadata: {
		title: spotifyTrack?.name,
		artist: spotifyTrack?.artists?.[0]?.name,
		album: spotifyTrack?.album?.name,
		images: spotifyTrack?.album?.images?.map((image) => ({
			src: image.url,
			sizes: `${image.width}x${image.height}`,
			type: "image/jpeg",
		})),
	},
});
