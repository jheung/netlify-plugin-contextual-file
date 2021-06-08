const fs = require("fs");
const fsPromises = require("fs").promises;

const handleSourceToDestination = async (strategy, source, destination) => {
	if (strategy === "append") {
		try {
			// Make sure the netlify.toml file exists
			if (!fs.existsSync(destination)) {
				throw new Error(
					`Could not find ${destination} to append ${source} to.`
				);
			}

			console.log(`Appending ${source} to ${destination}`);

			try {
				const sourceData = await fsPromises.readFile(source);
				await fsPromises.appendFile(destination, `\n\n${sourceData}`);
			} catch (err) {
				throw err;
			}
		} catch (err) {
			throw new Error(`Could not append ${source} to ${destination}: ${err}`);
		}

		const summary = `Appended ${source} to ${destination} successfully.`;
		console.log(summary);
		return summary;
	} else if (strategy === "replace") {
		try {
			if (fs.existsSync(source)) {
				console.log(`Overriding ${destination} with ${source}`);
			}
			await fsPromises.copyFile(source, destination);
		} catch (err) {
			throw new Error(
				`Could not replace ${destination} with ${source}: ${err}`
			);
		}

		const summary = `Replaced ${destination} successfully with ${source}.`;
		console.log(summary);
		return summary;
	}
};

module.exports = {
	onPostBuild: async ({ constants, inputs, utils }) => {
		const {
			target,
			target_path: _target_path,
			strategy,
			contexts,
			source_prefix,
			source_path: _source_path,
		} = inputs;

		// Check to see if the current context is active
		const activeByContext = contexts.includes(process.env.CONTEXT);
		const activeByBranch = contexts.includes(process.env.BRANCH);
		// Always use branch name if matched
		const activeContext = activeByBranch
			? process.env.BRANCH
			: activeByContext
			? process.env.CONTEXT
			: false;

		if (!activeContext) {
			return console.log(
				`netlify-plugin-contextual-file not enabled for context: ${process.env.CONTEXT} or by branch: ${process.env.BRANCH}`
			);
		}

		const source_path = _source_path || constants.PUBLISH_DIR;
		const source = `${source_path}/${source_prefix}${activeContext}`;

		const target_path = _target_path || constants.PUBLISH_DIR;
		const destination = `${target_path}/${target}`;

		// If this is an active context, make sure the target file exists
		if (activeContext && !fs.existsSync(source)) {
			const summary = `Could not find the source file: ${source}`;
			console.warn(summary);

			return utils.status.show({
				title: "Contextual File",
				summary,
			});
		}

		try {
			const summary = await handleSourceToDestination(
				strategy,
				source,
				destination
			);

			return utils.status.show({
				title: "Contextual File",
				summary,
			});
		} catch (err) {
			return utils.build.failBuild(err);
		}
	},
};
