import {createStore, applyMiddleware, compose} from 'redux';
import {createWrapper} from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from './storage';
import {parse, stringify} from 'flatted';

export const transformCircular = createTransform(
      (inboundState, key) => stringify(inboundState),
      (outboundState, key) => parse(outboundState),
  )
  

const persistConfig = {
      key: "keep-in-touch",
      whitelist: ["isLogged", "username"], 
      storage, // if needed, use a safer storage
      transforms: [transformCircular]
};

const initialState = {
      isLogged: false,
      username : null,
  };

const authReducer = (state = initialState, action) => {
      switch (action.type) {
            case 'LOGIN':
                  return {...state, isLogged: true};
            case 'USERNAME':
                  return {...state, username: action.payload};
            case 'LOGOUT':
                  return initialState;
            default:
                  return state;
      }
};

const persistedReducer = persistReducer(persistConfig, authReducer); // Create a new reducer with our existing reducer

//add chrome redux extension
const composeEnhancers = typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// create a makeStore function
const makeStore = () => {
      const store = createStore(persistedReducer,composeEnhancers(applyMiddleware(thunk)));
      store.__persistor = persistStore(store);
      return store;

}
// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: false});