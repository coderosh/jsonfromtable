import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
}

export default config
