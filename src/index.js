import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './index.scss';
import List from './components/List';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1>
        Zoomers Real-Time Status
      </h1>
    </header>
    <List />
  </div>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById( 'root' )
);

serviceWorker.unregister();

export default App;
