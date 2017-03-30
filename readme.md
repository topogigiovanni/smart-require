## smartRequire.js

> Based on [Basket.js](http://addyosmani.github.io/basket.js/)




##Introduction for the Non-Developer

SmartRequire.js loads your site's scripts into a page and saves them in localStorage so they can be reused after the session until they are expired. It also checks to see if the scripts are already in localStorage, and if not, loads them. This prevents unneccessary reloading of scripts and can improve load time and website performance.




[![Build Status](https://travis-ci.org/addyosmani/basket.js.svg?branch=gh-pages)](https://travis-ci.org/addyosmani/basket.js)


## Resources

### Unit Tests

We are also attempting to get as much unit test coverage as possible. For this reason, please add unit tests for any new or changed functionality and remember to lint and test your code using [grunt](http://gruntjs.com).

*Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!*

### Building

To build the project, you will first need to install the necessary dependencies (such as [RSVP](https://github.com/tildeio/rsvp.js)) using [npm](https://www.npmjs.com/) and [Bower](http://bower.io).

Run:

```sh
$ npm install & bower install
```

in the project root to get everything you need. Next, to actually build the project you will need [Grunt](http://gruntjs.com).

Run:

```sh
$ grunt release
```

to generate a new release, otherwise just running `grunt test` will run the unit tests.

