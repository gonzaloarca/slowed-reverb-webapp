export const createTrack = ({ metadata, audioFile, spotifyId }) => ({
	id: spotifyId,
	metadata,
	audioFile,
});
