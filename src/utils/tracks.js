export const createTrack = ({
	youtubeId,
	title,
	artist = null,
	album = null,
	duration,
	thumbnail = null,
	audioFile,
	spotifyId = null,
}) => ({
	id: youtubeId,
	title,
	artist,
	album,
	duration,
	thumbnail,
	audioFile,
	spotifyId,
});
