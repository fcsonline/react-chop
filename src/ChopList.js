import React, { Component } from 'react';

class ChopList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      scrollTop: 0,
      internalOffset: 0,
      windowSize: 30,
      estimatedHeight: 40,
      overscan: 10,
    };
  }

  componentDidMount() {
    const { estimatedHeight } = this.state;

    console.log(this.refs.innerScrollList.children.length);

    this.scrollTop = 0;
    this.refs.innerScrollContainer.style.height = `${this.props.rowCount * estimatedHeight}px`;
  }

  onScroll(event) {
    const maxHeight = this.state.estimatedHeight * this.props.rowCount;
    const overscanHeight = this.state.estimatedHeight * this.state.overscan;
    const scrollTop = this.refs.list.scrollTop;

    if (!scrollTop || (!this.state.offset && scrollTop < 0)) return;

    const realScrollTop = Math.min(Math.max(this.scrollTop + scrollTop * this.state.estimatedHeight, 0), maxHeight);
    const offset = Math.min(Math.floor(Math.max(scrollTop, 0) / this.state.estimatedHeight), this.props.rowCount - (this.state.windowSize - 200 / this.state.estimatedHeight));
    const burgerHeight = !offset ? 0 : Math.max(Math.round(scrollTop - overscanHeight), 0);

    console.log('s', scrollTop, burgerHeight, realScrollTop, offset);

    if (this.refs.burger) {
      this.refs.burger.style.height = `${burgerHeight}px`;
    }

    this.scrollTop = realScrollTop;

    this.setState({ offset });
  }

  render() {
    const { offset, windowSize } = this.state;

    return (
      <div ref='list' className="List" onScroll={this.onScroll.bind(this)}>
        <div ref='innerScrollContainer' className="innerScrollContainer">
        {offset > 0 && (
          <div ref='burger' className="Burger"/>
        )}

          <div ref='innerScrollList' className="innerScrollList">
          {[...Array(windowSize)].map((x, i) =>
            { return this.props.rowRenderer({key: 'k' + (i + offset), index: (i + offset)}) }
          )}
          </div>
        </div>
      </div>
    );
  }
};

export default ChopList;
