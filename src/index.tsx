import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './components/hello';

// Init
const main = document.getElementById('js-main');
if (main) {
	ReactDOM.render(<Hello />, main);
}
