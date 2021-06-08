# Contextual File Netlify Build Plugin

A Netlify Build Plugin to append to or replace a file based on the branch name or context

## Table of Contents

- [Installation and Configuration](#installation-and-configuration)
- [Configuration](#configuration)
- [Example](#example)
- [Credits](#credits)

## Installation and Configuration

This plugin is framework agnostic, but has been tailored to (via defaults) and tested against Gatsby + Netlify in order to create a proxy redirect in both local (through `netlify dev`) and deployed environments.

That being said, without any configuration, the plugin will append to the default redirect configuration file (`_redirect`) if a source file (`_redirect_[context]`) exists in the site's publish directory.

### Manual installation

1\. Create a `netlify.toml` in the root of your project. Your file should include the plugins section below:

```toml
[[plugins]]
  package = "netlify-plugin-contextual-file"
```

2\. From your project's base directory, use `npm`, `yarn`, or any other Node.js package manager to add this plugin to `devDependencies` in `package.json`.

```
npm install --save netlify-plugin-contextual-file
```

or

```
yarn add netlify-plugin-contextual-file
```

## Configuration

| Option          | Description                                                                                                                             | Default                                             |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `target`        | Filename to target - (e.g., `netlify.toml` or `_redirects`)                                                                             | `_redirects`                                         |
| `target_path`   | Path to the directory of the target file.                                                                                               | Publish directory configured in Netlify             |
| `strategy`      | Append to or replace the target file (`append` or `replace`)                                                                            | `append`                                            |
| `contexts`      | An array of contexts / branch names that the plugin will search for source files with. (e.g., ['production','branch-deploy','develop']) | `["production", "deploy-preview", "branch-deploy"]` |
| `source_prefix` | Prefix used to find source files matching the build context / branch name (e.g., `_redirects_production`)                               | `_redirects_`                                       |
| `source_path`   | Path to the directory containing the source files.                                                                                      | Publish directory configured in Netlify             |


## Example

Adding a branch name to target
```toml
[[plugins]]
  package = "netlify-plugin-contextual-file"
  [plugins.inputs]
    "contexts" = ["production", "branch-deploy", "develop"]
```

## Credits

This package extends the project [@quarva/netlify-plugin-contextual-redirects](https://github.com/quarva/netlify-plugin-contextual-redirects/) by generalizing the plugin, allow for targeting by branch names and allowing for more flexibility.