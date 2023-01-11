export const getAudioDurationFromBlob = async (blob) => {
	const context = new AudioContext();
	const buffer = await blob.arrayBuffer();
	const audioBuffer = await context.decodeAudioData(buffer);

	context.close();

	return audioBuffer.duration;
};
