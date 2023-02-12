import { camelCase, isArray, isObject, snakeCase, transform } from "lodash";

export const camelize = (obj) =>
	transform(obj, (acc, value, key, target) => {
		const camelKey = isArray(target) ? key : camelCase(key);

		acc[camelKey] = isObject(value) ? camelize(value) : value;
	});

export const snakeize = (obj) =>
	transform(obj, (acc, value, key, target) => {
		const snakeKey = isArray(target) ? key : snakeCase(key);

		acc[snakeKey] = isObject(value) ? snakeize(value) : value;
	});

export const formatSeconds = (seconds) => {
	const date = new Date(seconds * 1000);
	let result = "";
	if (seconds >= 3600) {
		result += `${date.getUTCHours()}:`;
		result += `${date.getUTCMinutes().toString().padStart(2, "0")}:`;
	} else {
		result += `${date.getUTCMinutes()}:`;
	}
	result += `${date.getUTCSeconds().toString().padStart(2, "0")}`;
	return result;
};
