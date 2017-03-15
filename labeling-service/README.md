# LabelingService
[Description](https://stroeerdigitalgroup.atlassian.net/wiki/display/IBBDEV/Labeling+service)

[API brainstorming](https://stroeerdigitalgroup.atlassian.net/wiki/display/~ondrej.kormanik/Labels+API+Brainstorming)

## Initial installation

To use [Yarn](https://yarnpkg.com) package manager run `npm install -g yarn` (_highly recommended_).
Then just run `yarn`.

## Usage

`yarn start` (`npm start`) starts application

`yarn test` (`npm test`) runs all tests once (without watching)

`yarn test:unit` runs all unit tests

`yarn test:integration` runs all integration tests

`yarn test:all` the same as `yarn test`

`yarn test:watch` (`npm run test:watch`) runs unit tests and starts watching for changes

`yarn lint` (`npm run lint`) runs linter

`yarn coverage` (`npm run coverage`) runs code coverage

`yarn security` (`npm run security`) checks for known vulnerabilities


## Committing changes

`yarn commit` (`npm run commit`) runs linter and forces the user to write commit message according to [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)  

`git push` ~~runs tests, linter and then~~ pushes changes to GitHub repository
