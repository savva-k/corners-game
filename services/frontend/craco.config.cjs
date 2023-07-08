const fs = require('fs');
const path = require('path');
const cracoBabelLoader = require('craco-babel-loader');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          resolveApp('../../packages/common/src'),
          resolveApp('../../packages/client/src'),
        ],
      },
    },
  ],
  webpack: {
    configure: {
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
            ],
        },
    },
  },
};
