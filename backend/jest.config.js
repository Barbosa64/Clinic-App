module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	clearMocks: true,
	setupFilesAfterEnv: ['<rootDir>/src/tests/prismaMock.ts'],
};
