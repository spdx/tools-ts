import sbom from '../../spdx-tools'
import { Package } from '../../spdx2model/package'
/*
This test is currently used by the ci to produce and validate an sbom.
 */

test('Creates a sample sbom', () => {
  const sampleSbom = './lib/e2e-tests/resources/sample.sbom.json'
  const document = sbom.createDocument('first-document', 'test namespace', 'Person: test creator', { spdxVersion: '2.3' })
  document.addPackages([new Package('first-package', 'https://download-location.com', { filesAnalyzed: false })])
  document.write(sampleSbom)
})
