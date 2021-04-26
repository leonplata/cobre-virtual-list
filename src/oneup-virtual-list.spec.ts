import { html, fixture, expect } from '@open-wc/testing';
import { VirtualList } from './oneup-virtual-list.js';
import './oneup-virtual-list.js';

describe('oneup-virtual-list', () => {
  it('should print something', async () => {
    const el = await fixture<VirtualList>(html`
      <oneup-virtual-list></oneup-virtual-list>
    `);
    expect(el).to.be.instanceOf(VirtualList);
  });
}); 