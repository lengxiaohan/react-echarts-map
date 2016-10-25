var expect = require('chai').expect;
var header = require('../../js/static/chinaMonitor.js').header;
var section = require('../../js/static/chinaMonitor.js').section;
var footer = require('../../js/static/chinaMonitor.js').footer;

describe('Shallow Rendering', function () {
  it('App\'s title should be Todos', function () {
    console.log(header);
    expect(header.props.children[0].type).to.equal('h1');
    expect(header.props.children[0].props.children).to.equal('Todos');
  });
});