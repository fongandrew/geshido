import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components/main';

// Init
const main = document.getElementById('js-main');
if (main) {
	ReactDOM.render(<Main />, main);
}
