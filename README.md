# WS-Base
Basic startingpoint for frontend-design-production based on Bootstrap 4 and incl. a VendorJS-Compiler, libsass, Autoprefixer and UglifyJS. Requires Node and Grunt command line tools `grunt-cli` to use the Gruntfile.

## Tooling setup
1. [Download and install Node](https://nodejs.org/).
2. Install the Grunt command line tools, `grunt-cli`, with `npm install -g grunt-cli`.
3. From the root `/WS-Base` directory run `npm install` to install dependencies listed in `package.json`.
4. Optional: Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/), install [Bundler](http://bundler.io/) with `gem install bundler`, and finally run `bundle install`. This will install all Ruby dependencies, such as Jekyll and plugins. 
5. Download [JSVendor](https://github.com/SirAnselot/JSVendor), unpack and place one level above root `(WS-Base/../vendor)` to use in multiple repros, or inside root `/WS-Base/vendor` and adjust vendor path in package.json `config.files.js.vendor` from `../vendor` to `vendor`. To add, change or remove Vendor-Scripts, edit file `grunt/vendorBridge.json`.
