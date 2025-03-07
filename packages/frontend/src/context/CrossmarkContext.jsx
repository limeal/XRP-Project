import { createContext, useContext } from 'react'

export const CrossmarkContext = createContext()

export const useCrossmark = () => {
  return useContext(CrossmarkContext)
}
