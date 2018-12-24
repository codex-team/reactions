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
    const testClassList: string[] = ['testClass1', 'testClass2', 'testClass3'];
    const testTextContent: string = 'testTextContent';
    const testElement: HTMLElement = DOM.make('div', testClassList, { textContent: testTextContent });

    assert.equal(testElement.classList.length, testClassList.length);

    assert.equal(testElement.tagName, 'DIV');

    for (const i in testClassList) {
      assert.equal(testElement.classList[i], testClassList[i]);
    }

    assert.equal(testElement.textContent, testTextContent);
  });

  it('should correctly create elements with single class', () => {
    const testClass: string = 'testClass';
    const testElement: HTMLElement = DOM.make('div', testClass);

    assert.equal(testElement.classList.length, 1);

    assert.equal(testElement.tagName, 'DIV');

    assert.equal(testElement.classList[0], testClass);
  });
});
