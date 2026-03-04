import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS ở đây

// 1. Import Provider từ react-redux và store bạn vừa tạo
import { Provider } from 'react-redux';
import store from './store'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Bọc Provider quanh App và truyền store vào */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);