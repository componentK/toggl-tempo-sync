# Changelog

All notable changes to this project will be documented in this file.

## 2.3.0

- added Toggl project ID filter

## 2.2.1

- fixed mapping issue IDs for project keys which moved to a different project, e.g JIRA-123 -> OTHER-123

## 2.2.0

- added Jira API configuration requirement (due to Tempo dropping `issueKey` support)
- updated tempo API to v4
- removed `JiraAccountId` config (can now retrieve it via API)

## 2.1.0

- added better error logging
- added a flag to delete entries instead of creating them, e.g. `--delete`
- added rate limiter as the tempo API will throw errors if we post too often
- updated toggl API to version 9
- updated NPM packages and node min version
- skip entries below 30 seconds, and round up to 60 sec if above (tempo rejects entries sub 60 seconds)

## 2.0.0

- changed to using JIRA cloud instead of in premises
