Toggl to Tempo
===
Imports Toggl entries to Tempo provided the date start and end inputs

## Start

#### Setup
* First [install node] on your computer
  * `brew install node` if you have brew on your mac
  * `scoop install nodejs` if you have scoop on your windows
* Confirm by typing `npm -v` in the terminal, should see a version output, e.g. `6.9.0`
* Secondly, install this repo on your computer and update the packages:
```
git clone git@github.com:componentK/toggl-tempo-sync.git
cd toggl-tempo-sync
npm install
```
* Thirdly, you will need to copy the `./config/default.yml` to a new file `./config/user.yml`.
Then supply the fields with your credentials for both platforms Tempo and Toggl. 

## Usage

#### Parameters
* `from` - date to start import from, time will be the beginning of that date starting midnight, e.g. `01-31-19`
* `to` (default: `to`) - date to end the import on at `23:59:59` of that date,
 this will default to the `to` parameter if not provided. E.g. providing only `--to 01/31` will result in import for that whole day.
* `dryRun` (default: false) - runs the command in dry mode, meaning only reading operations will happen, no write operations

Valid date formats: `MM-DD-YYYY`, `MM-DD-YY`, `MM-DD`, can use `/` instead of `-`
- MM being month like `01` for January, use 0 to prepend, cannot be just 1 for January
- DD being the date like `31` for the 31st
- YY being the short year like `19` for 2019. Current year is assumed if not provided.
- YYYY being the full year, like `2019` Current year is assumed if not provided.

#### Running
```
node index.js --from 03-15 --to 03-18
// or
npm start -- --from=03-15 --to=03-18
```

## Misc
##### Why fork:
The original implementation was using Toggl's paid feature "Tasks" to figure out JIRA issue names. 
It was also too destructive with Tempo by deleting all entries using `from` date.
##### Todo's
* There is no actual sync between Toggl and Tempo, it is more of an importer than synchronizer
* There is no timezone offset here, it assumes UTC+1
* We are not using Toggl's paid features like `Tasks`,
 so it could be implemented, but that would require some major refactoring of this spaghetti
* A flag to allow to compound short entries, maybe any entry below 5 min can be compacted with others


[install node]: https://nodejs.org/en/download/
