import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import { Config } from 'stryker-api/config';
import { File } from 'stryker-api/core';
import TypescriptConfigEditor from '../../src/TypescriptConfigEditor';
import TypescriptTranspiler from '../../src/TypescriptTranspiler';
import { setGlobalLogLevel } from 'log4js';

describe('Use header file integration', function () {
  this.timeout(10000);
  let config: Config;  
  let inputFiles: File[];
  
  beforeEach(() => {
    setGlobalLogLevel('error');
    const configEditor = new TypescriptConfigEditor();
    config = new Config();
    config.set({
      tsconfigFile: path.resolve(__dirname, '..', '..', 'testResources', 'useHeaderFile', 'tsconfig.json'),
    });
    configEditor.edit(config);
    inputFiles = config.files.map((file) => new File(file, fs.readFileSync(file as string, 'utf8')));
  });
  
  afterEach(() => {
    setGlobalLogLevel('trace');
  });

  it('should be able to transpile source code', async () => {
    const transpiler = new TypescriptTranspiler({ config, produceSourceMaps: false });
    const transpileResult = await transpiler.transpile(inputFiles);
    expect(transpileResult.error).to.be.null;
    const outputFiles = transpileResult.outputFiles;
    expect(outputFiles.length).to.eq(1);
  });
});