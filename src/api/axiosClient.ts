import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

// meta.env.VITE_API_URL = autmatically uses the deployed backend url from the environment variables 
// which we set while creating a new webservice for the backend on the "Render" platform
// we need this backend api url in order to tell the "axios" where to send the requests, 
// bec we can't directly interact with db from frontend

// interceptors = it's a function provided by axios, which automatically adds "auth token" before sending any request
// types of tokens = auth token & security token
// auth token = access (short-lived), refresh(long-lived), bearer(type of access token), id & PAT token
// security token = CSRF token & nonce / anti-replay token

// diff b/w access & bearer token = when user logs in they recieve the access token, 
// but when the user makes any api call, that api takes the access token with them as a bearer token


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;


// types of web storages = 4 (localStorage, sessionStorage, cookies & indexedDB)


// localStorage (permanately stores data in HDD or SDD) = 
// stores data on the browser with no expiration date, 
// data will only be deleted when user clears the browser storage or site data
// that's why in localStorage we store only non-sensitive data like (user preferences, themes, language, etc.)
// the localStorage don't go in databse, it entirely stays on the browser in the user's local system 


// where does the localStorage data is stored ? = when we open the chrome browser, and there on that browser 
// if we open any website and in that website if we have applied our theme preference & done some settings,
// then all that data gets stored in the HDD (hard disk drive) or 
// the SSD (solid state drive) any of these whichever is present in our system, 
// bec. the chrome browser opens with the help of RAM, but as RAM don't save any data permanently, 
// so chrome just uses the HDD or SSD to store that localStorage data permanently on the user's local system


// RAM (random access memory) = 
// it's fast & temporarily stores apps, but only those applications which currently cpu is processing  
// eg- when user opens a website or multiple tabs in a browser, 
// that website data or all those tabs data is stored temporarily in RAM for fast access, 
// but when user closes that website, that website data is removed from RAM
// eg- when we open any application on our system, that application data is stored temporarily in RAM for fast access


// in HDD or SSD = anything which is stored wither temporarirly or permanently, this is decided by the flag checks
// sessionStorage (temporarily stores data in HDD or SDD) = it stores data per tab or window, once that is closed the data is gone,
// eg- the checkout page data or the signup form data 
// (for eg- some companies let the candidate fill a long 6-7 steps long form data in order to register 
// them on their career portal, so in this case the sessionStorage will keep the user inputs 
// stored for that particualr tab session, so that if the user tries to go back 
// then in that case they just don't lose their entered inputs)
// eg- if on any e-commerece website, if the user has applied some filters on the products, 
// then even if the user navigtes between different tabs of that website, 
// the applied filters will remain intact as long as the tab is not closed

// eg explained -
// Open Tab A → Product page
// Apply filters (e.g., color = white) → stored in sessionStorage
// Navigate to "About Us" page in the same tab (Tab A) → sessionStorage still holds the filter data
// Come back to Product page in same tab (Tab A)→ filter can still be applied, if the site reads sessionStorage when loading the page
// ✅ Key: The filters will remain only if the website’s code reads sessionStorage and applies it on page load.



// cookies (supports both temp/permananet stores data in HDD or SDD) = they are sent automatically with every HTTP request to the server,
// they can store both sensitive & non-sensitive data, 
// they have expiration date set by the server & if expiration is not set then 
// they are treated as session cookies (just like session storage, which gets lost once the tab/window is closed), 

// auth token is stored in cookies bec. whenever the http request is made to the server, 
// the server needs that auth token in order to verify if this request is coming from the authnenticated user or not
// also if we use httpOnly flag while storing the auth token in cookies,
// then in that case that auth token is not redable by the javascript code running on the browser,
// which makes it more secure from XSS attacks


// indexedDB (stores large amount of structured data in HDD or SDD) =
// eg- when we use progressive web apps (PWAs) like google docs,etc. in offline mode,
// then in that case all the documents data is stored in indexedDB on the user's local system
// so that when user comes online again all that data can be synced with the server
// eg - store shopping cart items locally so if the user reloads the page or loses connection, the cart persists