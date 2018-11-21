import { before, describe, it } from 'mocha';
import DOM from '../src/utils/dom';
import { assert } from 'chai';
import { domMock, deleteMock } from './mock';

describe('DOM', () => {
  before(() => {
    domMock();
  });

  after(() => {
    deleteMock();
  });

  it('should correctly create elements with multiple classes', () => {
    const testClassList: string[] = ['test1', 'test2', 'test3'];
    const testElement: HTMLElement = DOM.make('div', testClassList);

    assert.equal(testElement.classList.length, testClassList.length);
    for (const i in testClassList) {
      assert.equal(testElement.classList[i], testClassList[i]);
    }
  });
});
