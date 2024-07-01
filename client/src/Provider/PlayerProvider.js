import { createContext, useContext, useReducer } from "react"

export const PlayerTrackContext = createContext(null)
export const PlayerDispatchContext = createContext(null)

const PlayerReducer = (state, action) => {
  switch (action.type) {
    case "PLAY":
      return {
        currentTrack: action.payload,
        state: 'PLAYING'
      }
    case "PAUSE":
      if (state.state !== 'PLAYING') return state
      return {
        ...state,
        state: 'PAUSED'
      }
    default:
      return state
  }
}

export const usePlayerTrack = () => {
  return useContext(PlayerTrackContext)
}

export const usePlayerDispach = () => {
  const playerDispatch = useContext(PlayerDispatchContext)
  const play = (track) => playerDispatch({ type: 'PLAY', payload: track })
  const pause = () => playerDispatch({ type: 'PAUSE' })

  return {
    play,
    pause,
  }
}

export const PlayerProvider = ({ children }) => {
  const [playerTrack, dispatch] = useReducer(PlayerReducer, null)

  return (
    <PlayerTrackContext.Provider value={playerTrack}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerTrackContext.Provider>
  )
}