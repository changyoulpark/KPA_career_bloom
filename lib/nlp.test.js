import test from 'node:test';
import assert from 'node:assert';
import { parseActivities } from './nlp.js';

test('parseActivities parses multiple segments', () => {
  const transcript = '오늘 오전에 토익 단어 30분 외우고, 저녁에 자소서 문항 1개 40분 썼어';
  const acts = parseActivities(transcript);
  assert.strictEqual(acts.length, 2);
  assert.strictEqual(acts[0].durationSec, 1800);
  assert.strictEqual(acts[0].tag, '영단어');
  assert.strictEqual(acts[1].durationSec, 2400);
  assert.strictEqual(acts[1].tag, '자기소개서');
});

test('defaults duration to 25m when missing', () => {
  const transcript = '오전에 영어 단어 외웠어';
  const acts = parseActivities(transcript);
  assert.strictEqual(acts[0].durationSec, 1500);
});
