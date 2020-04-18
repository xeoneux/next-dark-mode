const { describe, it } = intern.getPlugin('interface.bdd')
const { expect } = intern.getPlugin('chai')

describe('app', () => {
  it('should load the example app', async test => {
    const { remote } = test
    await remote.get('http://localhost:3000')
  })
})
