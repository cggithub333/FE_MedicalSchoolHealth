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
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
    '^@api/request\\.js$': '<rootDir>/src/api/__mocks__/request.js',
    '^@api/fetch-response\\.js$': '<rootDir>/src/api/__mocks__/fetch-response.js',
    '\\./request\\.js$': '<rootDir>/src/api/__mocks__/request.js',
    '\\./fetch-response\\.js$': '<rootDir>/src/api/__mocks__/fetch-response.js',
  },

  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'import.meta': {
      env: {
        VITE_BASE_URL: 'http://localhost:8080/api/v1/',
        NODE_ENV: 'test'
      }
    }
  },

  // Only collect coverage for files that have tests
  collectCoverageFrom: [
    'src/components/parent/HealthManagement/PrescriptionSendingForm.jsx',
    'src/components/parent/HealthManagement/Declaration/VaccinationDeclarationContent.jsx',
    'src/components/parent/HealthCheckCampaignCard/HealthCheckSurveyByPupil.jsx',
    'src/pages/parent/vaccination-campaign/Surveys.jsx',
    'src/pages/parent/health-check-campaign/Surveys.jsx',
  ],

  coverageDirectory: 'coverage-focused',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/__test__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testTimeout: 10000,
  verbose: true,
};
