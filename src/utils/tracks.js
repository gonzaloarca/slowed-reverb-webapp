export const createTrack = ({
	youtubeId,
	title,
	artist = null,
	album = null,
	duration,
	thumbnail = null,
	audioBlob,
	spotifyId = null,
}) => ({
	id: youtubeId,
	title,
	artist,
	album,
	duration,
	thumbnail,
	audioBlob,
	spotifyId,
});
