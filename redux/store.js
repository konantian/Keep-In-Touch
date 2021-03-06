import thunk from 'redux-thunk';
import storage from './storage';
import { parse, stringify } from 'flatted';
import { createWrapper } from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';


export const transformCircular = createTransform(
      (inboundState, key) => stringify(inboundState),
      (outboundState, key) => parse(outboundState),
  )
  

const persistConfig = {
      key: "keep-in-touch",
      whitelist: ["username", "userId"], 
      storage, // if needed, use a safer storage
      transforms: [transformCircular]
};

const initialState = {
      username : null,
      userId : null,
  };

const authReducer = (state = initialState, action) => {
      switch (action.type) {
            case 'USERNAME':
                  return {...state, username: action.payload};
            case 'USER_ID':
                  return {...state, userId: action.payload};
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