const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/server.ts',
    target: 'node', // Important: Tells Webpack we are running on Node, not browser
    resolve: {
        extensions: ['.ts', '.js', '.graphql'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs', // Required for AWS Lambda to export 'handler' correctly
    },
    plugins: [
        // Copies the schema file to dist/graphql/schema.graphql
        new CopyPlugin({
            patterns: [
                { from: 'src/graphql/schema.graphql', to: 'graphql/schema.graphql' },
            ],
        }),
    ],
    // Optional: Exclude aws-sdk if you want to use the version pre-installed on Lambda
    // externals: {
    //   '@aws-sdk/client-dynamodb': 'commonjs @aws-sdk/client-dynamodb',
    //   '@aws-sdk/lib-dynamodb': 'commonjs @aws-sdk/lib-dynamodb',
    // },
};