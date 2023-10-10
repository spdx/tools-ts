import { DocumentCreationInfo } from '../document'

test('Add data license to document when initiating', () => {
  const documentCreationInfo = new DocumentCreationInfo('my name', 'the creator', {
    spdxVersion: 'V1',
    spdxId: 'id',
    documentNamespace: 'my namespace',
    created: 'creation date'
  })
  expect(documentCreationInfo.dataLicense).toBe('CC0-1.0')
})
