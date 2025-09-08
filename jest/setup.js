import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn(),
    show: jest.fn(),
  };
});

jest.mock('react-native-encrypted-storage', () => {
  return {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  };
});

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    Notifications: {
      requestPermission: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Debug: {
      setLogLevel: jest.fn(),
    },
  },
}));
