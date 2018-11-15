import {describe, it} from 'mocha';
import {expect, assert} from 'chai';
import Reactions from '../src/ReactionsModule';
import {JSDOM} from 'jsdom';

describe('addReaction', () => {
  const dom = new JSDOM();
  const testItem: any = '🤙';
  const testCount: number = 42;

  const {testEmoji, testCounter} =  Reactions.addReaction(testItem, testCount);

});
