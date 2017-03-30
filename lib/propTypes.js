'use strict';

exports.__esModule = true;
exports.defaultProps = exports.propTypes = exports.VERTICAL_DIRECTION = exports.HORIZONTAL_DIRECTION = undefined;

var _react = require('react');

var HORIZONTAL_DIRECTION = exports.HORIZONTAL_DIRECTION = 'horizontal';
var VERTICAL_DIRECTION = exports.VERTICAL_DIRECTION = 'vertical';

var propTypes = exports.propTypes = {
  itemCount: _react.PropTypes.number.isRequired,
  itemRenderer: _react.PropTypes.func.isRequired,
  overscan: _react.PropTypes.number,
  direction: _react.PropTypes.oneOf([HORIZONTAL_DIRECTION, VERTICAL_DIRECTION]),
  scrollTo: _react.PropTypes.number,
  scrollToItem: _react.PropTypes.number,
  shrink: _react.PropTypes.bool
};

var defaultProps = exports.defaultProps = {
  overscan: 0,
  direction: VERTICAL_DIRECTION
};