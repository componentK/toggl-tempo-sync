import { strict as assert } from 'assert'
import sameDay from '../data/toggl/compactAll/sameDay.js'
import diffDay from '../data/toggl/compactAll/diffDay.js'
import { getUniqueEntries, parseJiraData } from '../../helpers/entry.js'

describe('Check entry parser', () => {
  beforeEach(() => {})

  describe('Check uniqueness parser', () => {
    it('Unique only entries with summed up duration', () => {
      // noinspection JSCheckFunctionSignatures
      const entries = getUniqueEntries(sameDay.payload)
      assert.deepStrictEqual(entries, sameDay.expect)
    })

    it('Should test that multiple days do not adhere to the unique rule', () => {
      // noinspection JSCheckFunctionSignatures
      const entries = getUniqueEntries(diffDay.payload)
      assert.deepStrictEqual(entries, diffDay.expect)
    })
  })

  describe('Check key parser', () => {
    it('Should parse out the key correctly', () => {
      const fakeEntry = { description: 'MAGENTO-1234 Test entry' }
      // noinspection JSCheckFunctionSignatures
      const result = parseJiraData(fakeEntry)
      assert.deepStrictEqual(result, {
        issueKey: 'MAGENTO-1234',
        comment: 'Test entry',
        ...fakeEntry
      })
    })

    it('Should fail to parse unexpected description format and skip it', () => {
      const fakeEntry = { description: 'MAGENTO-XXX Test entry' }
      // noinspection JSCheckFunctionSignatures
      const result = parseJiraData(fakeEntry)
      assert.deepStrictEqual(result, fakeEntry)
    })

    it('Should fail to parse unexpected description format and skip it', () => {
      const fakeEntry = { description: 'MAGENTO Test entry' }
      // noinspection JSCheckFunctionSignatures
      const result = parseJiraData(fakeEntry)
      assert.deepStrictEqual(result, fakeEntry)
    })
  })
})
