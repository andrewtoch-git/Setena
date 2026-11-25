import { readFileSync } from 'fs';
import { join } from 'path';
import { CATALOGOS } from './catalogos';

describe('catálogos', () => {
  it('coinciden con mock-data/catalogos.json', () => {
    const json = JSON.parse(
      readFileSync(
        join(__dirname, '../../../mock-data/catalogos.json'),
        'utf8',
      ),
    );
    expect(JSON.parse(JSON.stringify(CATALOGOS))).toEqual(json);
  });
});
