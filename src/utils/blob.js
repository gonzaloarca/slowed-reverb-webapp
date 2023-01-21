export const arrayBufferToBlob = (arrayBuffer, type) =>
	new Blob([arrayBuffer], { type });

export const blobToArrayBuffer = async (blob) => {
	const reader = new FileReader();

	reader.readAsArrayBuffer(blob);

	return new Promise((resolve, reject) => {
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});
};
