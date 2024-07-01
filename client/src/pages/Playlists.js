import React, { useState } from "react"
import { usePlaylist } from "../hooks/usePlaylist"
import styles from "./Playlists.module.css"
import TrackRow from "../components/TrackRow"

const Playlists = () => {
  const { playlists } = usePlaylist()

  const [selectedPlaylist, setSelectedPlaylist] = useState('')

  const togglePlaylistSelection = (playlistName) => {
    if (selectedPlaylist === playlistName) {
      setSelectedPlaylist('')
    } else {
      setSelectedPlaylist(playlistName)
    }
  }

  const isSelected = (playlistName) => {
    return playlistName === selectedPlaylist
  }

  return (
    <>
      <div className={styles.playlists}>
        {
          Object.keys(playlists).map((playlistName) => (
            <div key={playlistName} className={styles.playlist}>
              <div className={styles.playlistTitle}  onClick={() => togglePlaylistSelection(playlistName)}>
                <div>{playlistName}</div>
                <button>
                  {
                    isSelected(playlistName) ? '▼' : '▲'
                  }
                </button>
              </div>
              {
                isSelected(playlistName) && playlists[playlistName].map(({ track }) => (
                  <TrackRow track={track} key={track.id} />
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Playlists