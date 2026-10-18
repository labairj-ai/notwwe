import {readFile,writeFile} from 'node:fs/promises';
import {load} from '../src/persistence/save.js';
import {controlReport} from '../src/systems/input/diagnostics.js';
const args=process.argv.slice(2),file=args.shift();
if(!file)throw Error('Usage: node scripts/control-report.mjs save.json [--build-info build-info.json] [--out report.json]');
let build=null,out=null;
while(args.length){const flag=args.shift(),value=args.shift();if(!value)throw Error('Missing option value');if(flag==='--build-info')build=JSON.parse(await readFile(value,'utf8'));else if(flag==='--out')out=value;else throw Error('Unknown option');}
const s=load(await readFile(file,'utf8'));if(!s.match)throw Error('Save has no match');
const report=JSON.stringify(controlReport(s.match,build),null,2)+'\n';if(out)await writeFile(out,report);else process.stdout.write(report);
