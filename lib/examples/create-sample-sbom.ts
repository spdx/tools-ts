import sbom from '../spdx-tools'
import { Package } from '../spdx2model/package'
/*
TODO:
The compiled version of this script could be run in the ci to create and validate a sample sbom.
To do that, add a separate rollup.config.ts and use it in package.json.
 */

const sampleSbom = './lib/examples/resources/sample.sbom.json'
const document = sbom.createDocument('first-document', 'test namespace', 'Person: test creator', { spdxVersion: '2.3' })
document.addPackages([new Package('first-package', 'https://download-location.com', { filesAnalyzed: false })])
document.write(sampleSbom)
