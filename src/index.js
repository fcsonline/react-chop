import React, { Component } from 'react';
//import Measure from 'react-measure';

import property from 'lodash.property';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import flatten from 'lodash.flatten';

import { propTypes, defaultProps, HORIZONTAL_DIRECTION } from './propTypes';
import { getItemsRangeToRender, getNextScrollState, getFinalBufferingState, getNextBufferingState } from  './itemsChopper';

const HORIZONTAL_LENSES = {
  size: property('offsetWidth'),
  getScroll: property('scrollLeft'),
  setScroll: (child, value) => { child['scrollLeft'] = value },
  dimension: property('width'),
  beforeMargin: property('marginLeft'),
  afterMargin: property('marginRight'),
  scrollClass: 'scrollHorizontal',
  makeStyles: (width) => ({width}),
  log: (msg) => { console.log(msg); },
}

const VERTICAL_LENSES = {
  size: property('offsetHeight'),
  getScroll: property('scrollTop'),
  setScroll: (child, value) => { child['scrollTop'] = value },
  dimension: property('height'),
  beforeMargin: property('marginTop'),
  afterMargin: property('marginBottom'),
  scrollClass: 'scrollVertical',
  makeStyles: (height) => ({height}),
  log: (msg) => { console.log(msg); },
}

class ChopList extends Component {

  constructor(props) {
    super(props);

    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);

    // Review this
    this.onResize = debounce(this.onResize, 150);
    this.onScroll = throttle(this.onScroll, 50);

    this.lenses = props.direction === HORIZONTAL_DIRECTION ? HORIZONTAL_LENSES : VERTICAL_LENSES;

    this.getSize = (child) => {
      // More info here: https://facebook.github.io/react/docs/refs-and-the-dom.html#caveats
      if (!child) {
        console.warn(`empty child`);
        return 0;
      }

      // TODO: get-node-dimensions package for this
      const style = window.getComputedStyle ? getComputedStyle(child, null) : child.currentStyle;

      const size = this.lenses.size(child);
      const beforeMargin = parseInt(this.lenses.beforeMargin(style), 10) || 0;
      const afterMargin = parseInt(this.lenses.afterMargin(style), 10) || 0;

      return beforeMargin + size + afterMargin;
    }

    this.state = {
      offset: 0, // index
      windowCount: 1, // amount
      burgerCount: 0, // amount
      estimatedItemSize: 0, // px
      isBuffering: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.itemCount !== nextProps.itemCount ||
           this.state.estimatedItemSize !== nextState.estimatedItemSize ||
           this.state.offset !== nextState.offset ||
           this.state.burgerCount !== nextState.burgerCount ||
           this.state.windowCount !== nextState.windowCount;
  }

  getRenderedItems() {
    // TODO: Review nwb/babel/arrays hell
    return flatten(this._innerScrollList.children);
  }

  getRenderedItemsSizes() {
    return this.getRenderedItems().map((child) => this.getSize(child));
  }

  getRenderedItemsTotalSize() {
    return this.getRenderedItemsSizes().reduce((totalSize, size) => totalSize + size, 0);
  }

  shouldRenderMoreItems(totalSize, renderedSize, totalItems, renderedItems) {
    return renderedSize < totalSize && renderedItems < totalItems;
  }

  startBuffering() {
    const { itemCount, shrink } = this.props;

    this.lenses.log('buffering...');
    const containerSize = this.getSize(this._list);

    if (!containerSize && !this.props.shrink) {
      this.lenses.log('Chop container has no size!!');
      return;
    }

    if (itemCount === 0) {
      return;
    }

    const renderedItemsCount = this.getRenderedItems().length;
    const renderedItemsTotalSize = this.getRenderedItemsTotalSize();

    const shouldRenderMoreItems = this.shouldRenderMoreItems(
      containerSize,
      renderedItemsTotalSize,
      itemCount,
      renderedItemsCount
    );

    if (shouldRenderMoreItems) {
      this.lenses.log(`need more items: rendered ${renderedItemsCount} items`);
      this.setState(getNextBufferingState({ renderedItemsTotalSize, renderedItemsCount, containerSize, shrink, itemCount }));
      return;
    }

    this.setState(getFinalBufferingState({ renderedItemsTotalSize, renderedItemsCount, containerSize }));
  }

  getOverscan() {
    return this.props.overscan || this.state.windowCount;
  }

  onResize() {
    if (this.state.isBuffering) {
      return;
    }

    this.lenses.log(`onResize`);
    this.startBuffering();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scrollTo !== this.props.scrollTo) {
      this.lenses.setScroll(this._list, nextProps.scrollTo);
    } else if (nextProps.scrollToItem !== this.props.scrollToItem) {
      const { estimatedItemSize } = this.state;
      const estimatedScrollPosition = estimatedItemSize * nextProps.scrollToItem;

      this.lenses.setScroll(this._list, estimatedScrollPosition);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isBuffering) {
      return;
    }

    this.lenses.log(`didUpdate`);
    this.startBuffering();
  }

  componentDidMount() {
    this.startBuffering();
  }

  onScroll(event) {
    const currentScrollPosition = this.lenses.getScroll(this._list);

    this.scrollTo(currentScrollPosition);
  }

  scrollTo(currentScrollPosition) {
    const { itemCount } = this.props;
    const { windowCount, estimatedItemSize } = this.state;
    const overscan = this.getOverscan();

    this.setState(getNextScrollState({
      itemCount,
      windowCount,
      estimatedItemSize,
      overscan,
      currentScrollPosition
    }));
  }

  getStyles() {
    const { itemCount } = this.props;
    const { estimatedItemSize, burgerCount } = this.state;

    const containerSize = Math.round(itemCount * estimatedItemSize);
    const burgerSize = Math.round(burgerCount * estimatedItemSize);

    let chopStyle = {};
    let containerStyle = this.lenses.makeStyles(containerSize);
    const burgerStyle = this.lenses.makeStyles(burgerSize);

    if (this.props.shrink) {
      chopStyle = {position: 'static', overflowY: 'scroll', overflowX: 'hidden', height: 'initial', margin: 'initial'};
      containerStyle = {...containerStyle, position: 'static'};
    }

    return {
      chopStyle,
      containerStyle,
      burgerStyle,
    };
  }

  renderElements() {
    const { itemCount } = this.props;
    const { offset, windowCount } = this.state;
    const overscan = this.getOverscan();
    const range = getItemsRangeToRender({itemCount, windowCount, offset, overscan});

    return range.map((i) => this.props.itemRenderer({key: `k${i}`, index: i}));
  }

  render() {
    const scrollClassName = this.lenses.scrollClass;
    const { chopStyle, containerStyle, burgerStyle } = this.getStyles();

    return (
      <div className='ChopList' ref={(c) => (this._list = c)} onScroll={this.onScroll} style={chopStyle}>
        <div className={`innerScrollContainer ${scrollClassName}`} style={containerStyle}>
          <div className='Burger' style={burgerStyle}/>
          <div className={`innerScrollList ${scrollClassName}`} ref={(c) => (this._innerScrollList = c)}>
            {this.renderElements()}
          </div>
        </div>
      </div>
    );
  }
};

ChopList.propTypes = propTypes;
ChopList.defaultProps = defaultProps;

export default ChopList;
