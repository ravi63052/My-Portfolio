import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapterAt } from '../src/data/story.js';

test('scroll chapters interpolate and reverse without retained state', () => {
  const anchors = [0, 1000, 2500, 4000, 6000, 7000];
  assert.equal(chapterAt(0, anchors), 0);
  assert.equal(chapterAt(1750, anchors), 1.5);
  assert.equal(chapterAt(4000, anchors), 3);
  assert.equal(chapterAt(1750, anchors), 1.5);
  assert.equal(chapterAt(9000, anchors), 5);
  assert.equal(chapterAt(-100, anchors), 0);
});
