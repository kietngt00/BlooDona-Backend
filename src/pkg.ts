import * as fs from 'fs';
import { join } from 'path';

const pkg = JSON.parse(
  fs.readFileSync(join(__dirname, '../package.json'), {
    encoding: 'utf8',
  }),
);

export default pkg
