module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      nodeIntegration: true,
      builderOptions: {
          "win": {
            "target": "nsis"
          }
      }
    }
  }
}
