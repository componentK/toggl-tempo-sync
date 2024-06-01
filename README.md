[![Build Status](https://travis-ci.com/componentK/toggl-tempo-sync.svg?branch=master)](https://travis-ci.com/componentK/toggl-tempo-sync)
[![Coverage Status](https://coveralls.io/repos/github/componentK/toggl-tempo-sync/badge.svg?branch=master)](https://coveralls.io/github/componentK/toggl-tempo-sync?branch=master)

Toggl to Tempo
===
Imports Toggl entries to Tempo provided the date start and end inputs

## Start

#### Format
We are currently using the free version of Toggl, so the JIRA ticket key is derived from the Toggl comment.
An example of such comment would be `MAGENTO-1234 This is a ticket`. Here the JIRA key will be `MAGENTO-1234`
and the comment for the work log will be `This is a ticket`.

#### Setup
* First [install node] on your computer
  * `brew install node` if you have brew on your mac
  * `scoop install nodejs` if you have scoop on your windows
* Confirm by typing `npm -v` in the terminal, should see a version output, e.g. `6.9.0`
* Secondly, install this repo on your computer and update the packages:
```shell script
git clone git@github.com:componentK/toggl-tempo-sync.git
cd toggl-tempo-sync
npm install
```
* Thirdly, you will need to copy the `./config/default.yml` to a new file `./config/user.yml`.
Then supply the fields with your credentials for both platforms Tempo and Toggl. 

## Usage

#### Parameters
These are passed when running the application (see Running section)

* `from` - date to start import from, time will be the beginning of that date starting midnight, e.g. `01-31-19`
* `to` (default: `to`) - date to end the import on at `23:59:59` of that date,
 this will default to the `to` parameter if not provided. E.g. providing only `--to 01/31` will result in import for that whole day.

Valid date formats: `MM-DD-YYYY`, `YYYY-MM-DD`, `MM-DD-YY`, `MM-DD`, can use `/` instead of `-`
- MM being month like `01` for January, use 0 to prepend, cannot be just 1 for January
- DD being the date like `31` for the 31st
- YY being the short year like `19` for 2019. Current year is assumed if not provided.
- YYYY being the full year, like `2019` Current year is assumed if not provided.

#### Configurations
As mentioned in the Setup part, there is a configuration section which should have certain config values for this application to work, user names and such.
For that you will need to modify the `./config/default.yml` values.

However, if you are a developer contributing, you may want to copy the `./config/default.yml` to a new file called `./config/user.yml` so that you do not
commit your credentials by mistake.

Available configurations:
* `togglBaseURL` - URI of Toggl API endpoint. A default is provided, but it may get updated over time
* `togglAPIToken` - API token found in Toggl, somewhere in the settings or profile
* `tempoUserName` - user name you use to log in to JIRA
* `tempoPassword` - password you use to log in to JIRA
* `tempoBaseURL` - you will need to adjust this to your JIRA url + tempo API path. For the most part, just replace `example.com` 
with the JIRA URL
* `utc` (default: +01:00) - UTC offset to be used for Toggl entry retrieval in *ISO 8601*, e.g. `+01:00` for UTC+1
* `delete` (default: false) - deletes the specified date entries from Tempo on the Atlassian server
* `dryRun` (default: false) - runs the command in dry mode, meaning only reading operations will happen, no write operations 
* `compact`
  * `all` (default: false)
    * `false` means that all Toggl entries will be imported into Tempo separately, even if they have the same summary
    * `true` means that summaries that are identical will be squished together into one Tempo entry and durations summed up.
    The start time will be of the first entry

Note that you could also use parameters to overwrite the file configurations. For example, the `dryRun` is set in the configuration
file, but it can be used when calling node (see Running section with parameter usage).

#### Running
Try running in `dryMode` first, just to make sure things are correct. The console will output a few errors if they occur,
but when the error happens, the entry is just skipped instead of halting the program.

```shell script
node index.js --from 03-15 --to 03-18
//
node index.js --from 03-15 --to 03-18 --dryRun true
//
node index.js --from 03-15 --to 03-18 --utc +03:00
//
npm start -- --from=03-15 --to=03-18
//
node index.js --from 03-15 --to 03-18 --dryRun --delete

// Can also accept no name parameters as first two
node index.js 03-15 03-18 --dryRun
npm start 03-15 03-18 --dryRun
```

## Misc
##### Why fork:
The original implementation was using Toggl's paid feature "Tasks" to figure out JIRA issue names. 
It was also too destructive with Tempo by deleting all entries using `from` date.
##### Todo's
* There is no actual sync between Toggl and Tempo, it is more of an importer than synchronizer
* We are not using Toggl's paid features like `Tasks`,
 so it could be implemented, but that would require some major refactoring of this spaghetti
* A flag to allow to compound short entries instead of all, maybe any entry below 5 min can be compacted with others
* Allow only specific Toggl clients to be imported
* Publish to NPM so that the plugin is globally available

[install node]: https://nodejs.org/en/download/
