interface StorageStrategy {
  constellation: {
    ttl: number;
    maxSize: number;
    priority: 'speed' | 'accuracy';
  };
  userPreferences: {
    sync: boolean;
    encryption: boolean;
  };
} 