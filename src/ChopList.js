import React, { Component } from 'react';
import './ChopList.css';

const DEFAULT_OVERSCAN = 5;
const DEFAULT_INITIAL_ELEMENT = 10;

class ChopList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      overscan: DEFAULT_OVERSCAN,
      burgerHeight: 0,
      debug: false,
    };
  }

  getCurrentChildrenMeanHeight() {
    const childHeights = [...this.refs.innerScrollList.children].map(child => child.offsetHeight);

    return childHeights.reduce((h1, h2) => h1 + h2) / childHeights.length;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.offset !== nextState.offset ||
           this.state.burgerHeight !== nextState.burgerHeight;
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Render');
  }

  componentDidMount() {
    const estimatedHeight = this.getCurrentChildrenMeanHeight();

    this.windowSize = Math.ceil(this.refs.list.offsetHeight / estimatedHeight);

    // Set real scrollbar size
    this.refs.innerScrollContainer.style.height = `${this.props.rowCount * estimatedHeight}px`;
  }

  onScroll(event) {
    const scrollTop = this.refs.list.scrollTop;

    const meanHeight = this.getCurrentChildrenMeanHeight();
    const offset = Math.min(Math.floor(scrollTop / meanHeight), this.props.rowCount - this.windowSize);
    const burgerHeight = !offset ? 0 : (offset - this.state.overscan) * meanHeight;

    if (this.state.debug) {
      console.group();
      console.log('Offset', offset);
      console.log('Element size', meanHeight);
      console.log('Elements', this.props.rowCount);
      console.log('Overscan', this.state.overscan);
      console.log('WindowHeight', this.refs.list.offsetHeight);
      console.log('WindowSize', this.refs.list.offsetHeight / meanHeight);
      console.log('Total', this.props.rowCount * meanHeight);
      console.log('Burger', burgerHeight);
      console.groupEnd();
    }

    this.setState({
      offset,
      burgerHeight: Math.round(burgerHeight)
    });
  }

  renderElements(renderedElements, realOffset) {
    return (
      [...Array(renderedElements)].map((x, i) =>
        { return this.props.rowRenderer({key: 'k' + (i + realOffset), index: (i + realOffset)}) }
      )
    );
  }

  render() {
    const { offset, burgerHeight, overscan } = this.state;

    const realOffset = Math.max(offset - overscan, 0);
    let renderedElements;

    if (this.windowSize) {
      renderedElements = this.windowSize + Math.min(offset, overscan) + Math.min(this.props.rowCount - (overscan + offset), overscan)
    } else {
      renderedElements = DEFAULT_INITIAL_ELEMENT; // TODO: Decide what for the initial render
    }

    return (
      <div ref='list' className="List" onScroll={this.onScroll.bind(this)}>
        <div ref='innerScrollContainer' className="innerScrollContainer">
          <div ref='burger' className="Burger" style={ { height: burgerHeight } }/>
          <div ref='innerScrollList' className="innerScrollList">
            {renderedElements > 0 && this.renderElements(renderedElements, realOffset)}
          </div>
        </div>
      </div>
    );
  }
};

export default ChopList;
