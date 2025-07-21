# Adding Unit Tests

## Step 1: Install the testing packages
We are going to use `jest` to add test cases to our application. In the terminal, run the following command:

```bash
npm install --save-dev jest
```

## Step 2: Update `package.json` to add the test scripts

In `package.json`, look for the `scripts` key and change the `test` key as followed:

```
 "scripts": {
    "test": "jest"
  },
  ```

  ## Step 3: Creat a `jest.config`  file in the same directory as `index.js`

Create a new file named `jest.config.js` and add the following content:

```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'data/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**'
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true
};
```
Note the `tests/setup.js` file -- this file will be used next to set up the testing environment.

## Step 4: Create the `tests/setup.js` file

The purpose of the `tests/setup.js` file is to set up the testing environment. 


