'use strict';

module.exports = (num) => {
	let words = require('./Words');
	words.sort(() => Math.random() - 0.5);
	return words.slice(0, num);
};