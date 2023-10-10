import sbom from '../../spdx-tools'
import { Package } from '../../model/package'
/*
This test is currently used by the ci to produce and validate an sbom.
 */

test('Creates a sample sbom', () => {
  const sampleSbom = './lib/e2e-tests/resources/sample.sbom.json'
  const document = sbom.createDocument('first document', 'test creator', { created: '2023-10-12T06:03:13.274Z' })
  document.addPackages([new Package('first-package')])
  document.write(sampleSbom)
})
