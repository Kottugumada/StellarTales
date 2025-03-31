const platformConfig = {
  ios: {
    arFramework: 'ARKit',
    minVersion: '13.0',
    arCapabilities: ['worldTracking', 'imageTracking']
  },
  android: {
    arFramework: 'ARCore',
    minVersion: '7.0',
    arCapabilities: ['worldTracking']
  },
  web: {
    arFramework: '8thWall',
    features: ['search', 'storytelling']
  }
}; 