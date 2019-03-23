const assert = require('assert').strict
const sameDay = require('../data/toggl/compactAll/sameDay')
const diffDay = require('../data/toggl/compactAll/diffDay')
const { getUniqueEntries } = require('../../helpers/entry')

describe('Check entry parser', () => {
  beforeEach(() => {})

  it('Unique only entries with summed up duration', async () => {
    const entries = getUniqueEntries(sameDay.payload)
    assert.deepStrictEqual(entries, sameDay.expect)
  })

  it('Should test that multiple days do not adhere to the unique rule', () => {
    const entries = getUniqueEntries(diffDay.payload)
    assert.deepStrictEqual(entries, diffDay.expect)
  })
})
