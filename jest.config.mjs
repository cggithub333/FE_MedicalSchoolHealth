export default {
  testEnvironment: 'jsdom',
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }],
  },

  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|@babel)/)',
  ],

  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1', // make shortcut as @hooks
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',  // make shortcut as @pages
    '^@api/(.*)$': '<rootDir>/src/api/$1',  // make shortcut as @api
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
    // Mock the request and fetch-response modules specifically (both alias and relative)
    '^@api/request\\.js$': '<rootDir>/src/api/__mocks__/request.js',
    '^@api/fetch-response\\.js$': '<rootDir>/src/api/__mocks__/fetch-response.js',
    '\\./request\\.js$': '<rootDir>/src/api/__mocks__/request.js',
    '\\./fetch-response\\.js$': '<rootDir>/src/api/__mocks__/fetch-response.js',
  },

  // Handle ES modules
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'import.meta': {
      env: {
        VITE_BASE_URL: 'http://localhost:8080/api/v1/',
        NODE_ENV: 'test'
      }
    }
  },

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__test__/**',
    '!src/**/__mocks__/**',
    '!src/main.jsx',
    '!src/vite-env.d.ts',
  ],

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/__test__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Increase timeout for async operations
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
};