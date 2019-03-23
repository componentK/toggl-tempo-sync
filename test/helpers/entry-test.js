const assert = require('assert').strict
const payload = require('../data/toggl/rawEntries')
const compare = require('../data/toggl/uniqueEntries')
const { getUniqueEntries } = require('../../helpers/entry')

describe('Check entry parser', () => {
  beforeEach(() => {})

  it('Unique only entries with compact durations', async () => {
    const entries = getUniqueEntries(payload)
    assert.deepStrictEqual(entries, compare)
  })
})
