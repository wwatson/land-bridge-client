import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import AppRouter from './routes';

const appElement = document.getElementById('root');

ReactDOM.render(
  <AppRouter />,
  appElement
);
