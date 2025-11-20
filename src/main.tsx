import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./styles/global.css";

// ReactDOM = contains methods to interact with the DOM (methods like = createRoot, render, etc.)
// App = main component of the application, which includes routing and layout
// Provider = makes the Redux store available to the rest of the app
// store = the Redux store that holds the application state
// global.css = global styles for the application

// document = represents the HTML document(webpage) loaded in the browser

// getElementById("root") = selects the HTML element with the ID "root" 
// where the main react app will be visible in that div whose id is "root"

// document.getElementById("root")! = non-null assertion operator,
// tells TypeScript that we are sure this element exists and is not null

// StrictMode = helps identify potential problems in the application during development
// Provider = wraps the App component to provide access to the Redux store
// store = the Redux store that holds the application state

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode> 
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

