import sbom from '../spdx-tools'
import * as fs from 'fs'
import mock from 'mock-fs'
import { Package } from '../model/package'

afterEach(() => {
  mock.restore()
})

test('Creates and writes minimal document', () => {
  mock({ 'root/dir': { 'existingFile.txt': '' } })
  const testfile = 'root/dir/sbom.spdx.json'

  const document = sbom.createDocument('test document', 'test creator', { created: '2023-10-12T06:03:13.274Z' })
  document.addPackages([new Package('test-package')])
  document.write(testfile)

  expect(fs.lstatSync(testfile).isFile()).toBe(true)
  const writtenFileContent = fs.readFileSync(testfile, { encoding: 'utf-8' })
  const parsedFileContent = JSON.parse(writtenFileContent)
  expect(parsedFileContent.packages[0].name).toBe('test-package')
  expect(parsedFileContent.creationInfo.name).toBe('test document')
  expect(parsedFileContent.creationInfo.creator).toBe('test creator')
})
