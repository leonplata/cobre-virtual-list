import { html, fixture, expect } from '@open-wc/testing';
import { VirtualList } from './cobre-virtual-list.js';
import './cobre-virtual-list.js';

describe('cobre-virtual-list', () => {
  it('should print something', async () => {
    const el = await fixture<VirtualList>(html`
      <cobre-virtual-list></cobre-virtual-list>
    `);
    expect(el).to.be.instanceOf(VirtualList);
  });
}); 