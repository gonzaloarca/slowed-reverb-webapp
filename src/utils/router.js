/**
 *
 * @param {string} path : the path to replace the path variables with, e.g. '/projects/:projectId'
 * @param {object} variables : the variables to replace in the path, e.g. { projectId: 123 }
 * @returns {string} the path with the path variables replaced, e.g. '/projects/1'
 */
export const replacePathVariables = (path, variables) => {
	let newPath = path;
	Object.keys(variables).forEach((variable) => {
		newPath = newPath.replace(`:${variable}`, variables[variable]);
	});
	return newPath;
};
