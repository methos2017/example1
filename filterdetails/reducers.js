import { combineReducers } from 'redux'
import { ADD_ITEM, RESET, ADD_COMPLECTS, RESET_COMPLECTS } from './actions.js'
// import { REHYDRATE } from 'redux-persist/constants'

function complects (state = [], action) {
  switch (action.type) {
    case ADD_COMPLECTS: {
      console.log('the action is ' + JSON.stringify(action.text))

      console.log('and the current state is ' + JSON.stringify(state))

      // return [...state, action.text]

      return state.concat(action.text)
    }
    case RESET_COMPLECTS: {
      console.log('Welcome to reset complects')

      state = []

      return state
    }
    default:
      return state
  }
}

function prods (state = {}, action) {
  // console.log('wercome to secury ' + action.text)
  switch (action.type) {
    // case 'persist/REHYDRATE': {
    //   // console.log(action.payload)
    //   return { ...state, ...action.payload }
    // }
    // case REHYDRATE: {
    //   return state
    // }

    case ADD_ITEM: {
      return {
        ...state,
        [action.mode]: { ...state[action.mode], [action.var1]: action.text }
      }
    }

    case RESET: {
      // console.log('the state is ... ' + JSON.stringify(state))
      state = {}
      // console.log('the state is after... ' + JSON.stringify(state))

      // state = 0

      return state
    }

    default: {
      // console.log('the state is: ... ' + JSON.stringify(action.text))

      // state = undefined

      return state
    }
  }
}

const itemApp = combineReducers({
  // visibilityFilter,
  prods,
  complects
})

// function todoApp (state = {}, action) {
//   let tempVar = 'secure'

//   return {
//     // visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//     registry: secure(state.secure, action)
//   }
// }

export default itemApp
