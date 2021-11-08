import { html as testHtml, fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import { VirtualList } from './cobre-virtual-list.js';
import './cobre-virtual-list.js';

describe('cobre-virtual-list', () => {
  it('should have 2 children if the virtual list height is twice than the item height', async () => {
    const el = await fixture<VirtualList>(testHtml`
      <cobre-virtual-list
        style="height: 48px;"
        .items=${[1, 2, 3, 4, 5]}
        .itemHeight=${24}
        .itemTemplate=${(item: number, slot: string, index: number) => html`
          <div slot=${slot}>${item} - ${index}</div>
        `}>
      </cobre-virtual-list>
    `);
    expect(el.children[0].textContent).to.be.equal('1 - 0');
    expect(el.children[0].getAttribute('slot')).to.be.equal('0');
    expect(el.children[1].textContent).to.be.equal('2 - 1');
    expect(el.children[1].getAttribute('slot')).to.be.equal('1');
    expect(el.children[2]).to.be.undefined;
  });
  it('should react to "items" property changes', async () => {
    const el = await fixture<VirtualList>(testHtml`
      <cobre-virtual-list
        style="height: 48px;"
        .items=${[1, 2, 3, 4, 5]}
        .itemHeight=${24}
        .itemTemplate=${(item: number, slot: string, index: number) => html`
          <div slot=${slot}>${item} - ${index}</div>
        `}>
      </cobre-virtual-list>
    `);
    el.items = [1];
    await new Promise(resolve => setTimeout(resolve));
    expect(el.children[0].textContent).to.be.equal('1 - 0');
    expect(el.children[0].getAttribute('slot')).to.be.equal('0');
    expect(el.children[1]).to.be.undefined;
  });
});
