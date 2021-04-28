import { LitElement, html, css, property, internalProperty, TemplateResult } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { calculateRange, RangeResult } from './math';
import { render } from 'lit-html';

export class VirtualListBase extends LitElement {

  @property({ type: Object })
  scrollTarget: HTMLElement = this;

  @property({ type: Array })
  items: any[] = [];

  @property({ type: Number })
  itemHeight: number = 24;

  @property({ type: Number })
  itemColumns: number = 1;

  @property({ type: Object })
  itemTemplate?: (item: any) => TemplateResult;

  @internalProperty()
  private _virtualItems: any[] = [];

  @internalProperty()
  private _range: RangeResult = { head: 0, length: 0 };

  private _resizeObserver: ResizeObserver = new ResizeObserver(this.calculateViewport);

  private _intersectionObserver: IntersectionObserver = new IntersectionObserver(this.handleIntersection, { threshold: [0] });

  constructor() {
    super();
    this.calculateViewport = this.calculateViewport.bind(this);
    this.handleIntersection = this.handleIntersection.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._intersectionObserver.observe(this);
    this.scrollTarget.addEventListener('scroll', this.calculateViewport);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.unobserve(this.scrollTarget);
    this._intersectionObserver.unobserve(this);
    this.scrollTarget.removeEventListener('scroll', this.calculateViewport);
  }

  calculateViewport() {
    if (this.scrollTarget) {
      const scrollTargetRect = this.scrollTarget.getBoundingClientRect();
      const range = calculateRange(this.items.length, this.itemHeight, this.itemColumns, scrollTargetRect.height, this.scrollTarget.scrollTop);
      const virtualItems: any[] = [];
      for (let i = range.head; i < (range.head + range.length); i++) {
        virtualItems.push(this.items[i]);
      }
      this._range = range;
      this._virtualItems = virtualItems;
    }
  }

  handleIntersection(entries: IntersectionObserverEntry[]) {
    const thisEntry = entries.find(entry => entry.target === this);
    if (thisEntry) {
      if (thisEntry.isIntersecting) {
        this._resizeObserver.observe(this.scrollTarget);
      } else {
        this._resizeObserver.unobserve(this.scrollTarget);
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      overflow-y: auto;
      position: relative;
    }
  `;

  private _renderItemTemplate() {
    const itemTemplate = this.itemTemplate;
    if (itemTemplate) {
      const items = this._virtualItems;
      const head = this._range.head;
      const itemHeight = this.itemHeight;
      const templates = items.map((item, index) => {
        const position = (head + index) * itemHeight;
        const transform = `translate3d(0, ${position}px, 0)`;
        const style = styleMap({transform});
        const template = itemTemplate(item);
        return html`<div style=${style}>${template}</div>`;
      });
      render(html`${templates}`, this);
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    this._renderItemTemplate();
  }

  firstUpdated() {
    this.calculateViewport();
  }

  render() {
    const height = `${this.items.length * this.itemHeight}px`;
    const style = styleMap({height});
    return html`<div style=${style}><slot></slot></div>`;
  }
}
