import { DocumentCreationInfo } from '../document-creation-info'

test('Add data license to document when initiating', () => {
  const documentCreationInfo = new DocumentCreationInfo('my name', 'my namespace', 'the creator', {
    spdxVersion: '2.3',
    created: new Date()
  })
  expect(documentCreationInfo.dataLicense).toBe('CC0-1.0')
})
