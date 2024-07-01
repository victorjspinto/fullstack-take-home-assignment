import React from "react"
import useTracks from "../hooks/useTracks"
import TrackRow from "../components/TrackRow"
import { usePlayerDispach, usePlayerTrack } from "../Provider/PlayerProvider"

const Tracks = () => {
  const { tracks } = useTracks()

  const { play } = usePlayerDispach()

  return (
    <>
      {tracks.map((track, ix) => (
        <TrackRow  key={ix} track={track} handlePlay={play} />
      ))}
    </>
  )
}

export default Tracks