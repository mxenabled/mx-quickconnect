// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { override, useBabelRc } = require("customize-cra");

module.exports = override(
  useBabelRc(),
  addWebpackModuleRule(
    {
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/@kyper/'),
      exclude: [/__tests__/],
      loader: 'babel-loader',
      query: {
         presets: ['@babel/preset-react'],
      },
   },

    )
)

