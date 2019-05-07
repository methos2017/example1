/*
 * action types
 */

export const ADD_ITEM = 'ADD_ITEM'
export const RESET = 'RESET'
export const ADD_COMPLECTS = 'ADD_COMPLECTS'
export const RESET_COMPLECTS = 'RESET_COMPLECTS'

export function addItem (text, var1, mode) {
  return { type: ADD_ITEM, text, var1, mode }
}

export function addComplects (text) {
  return { type: ADD_COMPLECTS, text }
}

export function Reset () {
  return { type: RESET }
}

export function ResetComplects () {
  return { type: RESET_COMPLECTS }
}
