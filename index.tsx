// index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
// import { SgwtElement } from "esgwt/sgwt-widgets-react";
import App from "./App";

// Styles
// import "@se-bootstrap/core/dist/css/se-bootstrap-standard.css";
// import "@sg-bootstrap/icons/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Type for global import.meta.env
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const rootElement = document.querySelector("#root");

if (rootElement) {
  setTimeout(() => {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        {/* <SgwtElement> */}
          <App />
        {/* </SgwtElement> */}
      </React.StrictMode>
    );
  }, 500);
}

// import React from 'react'
// import { createRoot } from 'react-dom/client'

// function App() {
//   return (
//     <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
//       <h1>React + Webpack + JSX</h1>
//       <p>Hello, world!</p>
//     </div>
//   )
// }

// const container = document.getElementById('root')
// const root = createRoot(container)
// root.render(<App />)


