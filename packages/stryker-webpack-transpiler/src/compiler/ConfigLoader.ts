import * as path from 'path';
import { Configuration } from 'webpack';
import { StrykerWebpackConfig } from '../WebpackTranspiler';
import { getLogger } from 'log4js';

const PROGRESS_PLUGIN_NAME = 'ProgressPlugin';

export default class ConfigLoader {
  private _log = getLogger(ConfigLoader.name);
  private _loader: NodeRequireFunction;

  public constructor(loader?: NodeRequireFunction) {
    this._loader = loader || require;
  }

  public load(config: StrykerWebpackConfig): Configuration {
    let webpackConfig: Configuration;

    try {
      webpackConfig = this._loader(path.resolve(config.configFile));
      if (config.silent) {
        this.configureSilent(webpackConfig);
      }
    } catch (err) {
      this._log.debug(`Webpack config "${config.configFile}" not found, trying Webpack 4 zero config`);
      webpackConfig = { context: config.context };
    }

    return webpackConfig;
  }

  private configureSilent(webpackConfig: Configuration) {
    if (webpackConfig.plugins) {
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
        if (plugin.constructor && plugin.constructor.name === PROGRESS_PLUGIN_NAME) {
          this._log.debug('Removing webpack plugin "%s" to keep webpack bundling silent. Set `webpack: { silent: false }` in your stryker.conf.js file to disable this feature.', PROGRESS_PLUGIN_NAME);
          return false;
        } else {
          return true;
        }
      });
    }
  }
}
