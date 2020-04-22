# reddit_notifier
 
## Build
 
```bash
npm install
npm install nodemon # if you dont already have it
```
 
 
## Run
 
```bash
npm start
```
## Unit tests
There are a couple of (real) unit tests that need no dependencies (like a MongoDB installation) and can be run very quickly. The tests are run by [Jest](https://jestjs.io).
 
### How to run the unit tests
You can run Jest in many ways:
 
If you installed in globally (`npm install jest --global`) then you can just call `jest` from the root directory of this repository.
 
If you installed it locally (that is the default when `npm install` was run) you can call it by `node_modules/.bin/jest`.
 
There is also an npm script to run the tests and have Jest watch for file changes so that tests are automatically run when a source file is modified. To use this call `npm run test` from command line.
 
### How to debug unit tests
 
#### Using Chrome Inspect tool
 
As a prerequisite, put a `debugger;` statement to the line in your test file where you'd like the debugger to stop at. Next:
 
1. Start Jest test running in debugging mode: `npm run test-debug`
2. Open Chrome and navigate to `chrome://inspect`
3. In The **Remote Target** section there should be a **Target** element pointing to your Jest instance
4. Click on **inspect**, this will bring up Chrome's developers tools window
5. If the Debugger is paused (in *jest.js* file), press **F8** to let it continue running
6. Within a couple of seconds the debugger should again be paused at the location where you put the `debugger;` statement
7. Now you can debug your code using Chrome!
 
#### Using Visual Studio Code (recommended)
 
As a prerequisite, put a `debugger;` statement to the line in your test file where you'd like the debugger to stop at. Or, another option is to put a breakpoint to the same line.
 
1. Enable Auto attach feature in VSCode:
   1. Open **Command Palette** from the **View** menu or press **CTRL+SHIFT+P** (default)
   2. Search for **Toggle Auto Attach** and click on it
   3. This should either enable or disable the Auto Attach feature
   4. When enabled, you can see **Auto Attach: On** on the bottom bar in VSCode
2. Open Terminal window in Visual Studio Code
3. Start Jest test running in debugging mode by: `npm run test-debug`
4. The debugger should automatically stop at the desired line in your test file
5. Now you can debug your code using VSCode!
 
If you want to run `npm run test-debug` from a different Terminal window (outside of VSCode) the Auto Attach feature won't work. For this you need to start the `test-debug` debug configuration to attach to the debugger:
1. Open Debug window from left sidebar (CTRL+SHIFT+D)
2. Choose `test-debug` from list of configurations
3. Click on Start debugging icon

