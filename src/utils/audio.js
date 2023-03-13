/**
 *
 * @param {Blob} file
 * @returns {Promise<number | null>} duration in seconds or null if error
 */
export const getAudioDuration = async (file) => {
	console.log("getAudioDuration");
	const url = URL.createObjectURL(file);

	return new Promise((resolve) => {
		const audio = document.createElement("audio");
		audio.muted = true;
		const source = document.createElement("source");
		source.src = url; //--> blob URL
		audio.preload = "metadata";
		audio.appendChild(source);
		audio.onloadedmetadata = function () {
			try {
				if (
					(!audio.duration && audio.duration !== 0) ||
					isNaN(audio.duration)
				) {
					resolve(null);
					return;
				}

				resolve(audio.duration);
			} catch (err) {
				console.error("error getting audio duration", err);
				resolve(null);
			}
		};
	}).catch((err) => {
		console.error("error getting audio duration", err);
		return null;
	});
};
