import React from "react"
import { Provider } from "react-redux"
import { createStore as reduxCreateStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"
import rootReducer from "components/state"
import rootSaga from "components/state/sagas"
import Root from "components/Root/Root"

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

const store = reduxCreateStore(rootReducer, enhancer)
sagaMiddleware.run(rootSaga)

export const wrapRootElement = ({ element }) => {
  return (
    <Provider store={store}>
      <Root>{element}</Root>
    </Provider>
  )
}
