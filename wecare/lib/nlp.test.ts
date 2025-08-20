import test from 'node:test';
import assert from 'node:assert';
import { parseActivities } from './nlp.ts';

// Ensure parseActivities returns objects shaped like Activity without id/date
// by checking keys and basic types.
test('parseActivities returns Activity-like objects', () => {
  const transcript = '오늘 오전에 토익 단어 30분 외우고, 저녁에 자소서 문항 1개 40분 썼어';
  const acts = parseActivities(transcript);
  assert.strictEqual(acts.length, 2);
  const act = acts[0];
  assert.strictEqual(typeof act.durationSec, 'number');
  assert.strictEqual(typeof act.tag, 'string');
  assert.strictEqual(typeof act.note, 'string');
  assert.strictEqual(typeof act.transcript, 'string');
  assert.ok(Array.isArray(act.keywords));
  const keys = Object.keys(act).sort();
  assert.deepStrictEqual(keys, ['durationSec', 'keywords', 'note', 'tag', 'transcript'].sort());
});
