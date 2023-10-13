import sbom from '../spdx-tools'
import { Package } from '../spdx2model/package'
/*
TODO:
The compiled version of this script could be run in the ci to create and validate a sample sbom.
To do that, add a separate rollup.config.ts and use it in package.json.
 */

const sampleSbom = './lib/examples/resources/sample.sbom.json'
const document = sbom.createDocument('2.3', 'first document', 'test creator', { created: '2023-10-12T06:03:13.274Z' })
document.addPackages([new Package('first-package')])
document.write(sampleSbom)
