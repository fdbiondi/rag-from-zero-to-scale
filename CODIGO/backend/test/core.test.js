import test from 'node:test';
import assert from 'node:assert/strict';
import {chunkText,documentId,normalizeScore} from '../src/core.js';
test('chunking keeps overlap',()=>assert.deepEqual(chunkText('abcdefg',4,1), ['abcd','defg']));
test('blank documents have no chunks',()=>assert.deepEqual(chunkText('   '),[]));
test('invalid chunk settings are rejected',()=>assert.throws(()=>chunkText('abc',4,4)));
test('IDs are deterministic',()=>assert.equal(documentId('abc'),documentId('abc')));
test('scores are rounded',()=>assert.equal(normalizeScore(0.12346),0.123));
