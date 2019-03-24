const assert = require('assert').strict
const { formatDate, fromDate, toDate } = require('../../helpers/date')

describe('Date helper tests', () => {
  describe('Make sure the dates are output correctly', () => {
    it('Date is well formatted', () => {
      const inputs = [
        ['03-23-2019', '2019-03-23'],
        ['03-23-19', '2019-03-23'],
        ['03-23', '2019-03-23'],
        ['2019-03-23', '2019-03-23']
      ]
      inputs.forEach((input) => {
        const dateBack = formatDate(input[0])
        assert.strictEqual(dateBack, input[1])
      })
    })

    it('Should throw an error on bad date input', () => {
      try {
        formatDate('meh')
      } catch (e) {
        assert.ok(e instanceof Error)
        return
      }
      throw new Error('Was supposed to throw an error in test')
    })
  })
  describe('Dates are correctly formatted for Toggl', () => {
    it('To and from date are well formatted', () => {
      const resultFrom = fromDate('2019-03-15', '-05:00')
      assert.strictEqual(resultFrom, '2019-03-15T00%3A00%3A00-05%3A00')
      const resultTo = toDate('2019-03-15', '+10:00')
      assert.strictEqual(resultTo, '2019-03-15T23%3A59%3A59%2B10%3A00')
    })
  })
})
