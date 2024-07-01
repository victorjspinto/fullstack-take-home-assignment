import React, { useEffect, useState } from "react";
import styles from "./TrackRow.module.css";
import { usePlaylist } from "../hooks/usePlaylist";
import { usePlayerDispach } from "../Provider/PlayerProvider";

const AddToPlaylist = ({ track }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const { createPlaylist, addToPlaylist, removeFromPlaylist, playlists, isOnPlaylist } = usePlaylist()

  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest(`.${styles.addToPlaylist}-${track.id}`)) return
      setIsMenuVisible(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [track.id])

  const onSubmitNewPlaylist = (e) => {
    e.preventDefault()
    createPlaylist({ track, playlistName: e.target[0].value })
    setIsMenuVisible(false)
  }

  return (
    <>
      <button className={styles.addToPlaylist + ` ${styles.addToPlaylist}-${track.id}`} onClick={() => setIsMenuVisible(true)}>
        {/* context menu */}
        {isMenuVisible && (<div className={`${styles.playlistSelector} ${isMenuVisible ? styles.playlistSelectorVisible : ''}`}>
          <form onSubmit={onSubmitNewPlaylist}>
            <input type="text" placeholder="Add to playlist" />
            <input type="submit" value="+" />
          </form>

          {/* todo: list existing playlists */}
          <ul>
            {
              Object.keys(playlists).filter(playlistName => playlistName !== 'FAVORITE').map((playlistName) => (
                <li key={playlistName}>
                  <a href="#" onClick={() => isOnPlaylist(track, playlistName) ? removeFromPlaylist({ track, playlistName }) : addToPlaylist({ track, playlistName })}>
                    {
                      isOnPlaylist(track, playlistName) ? '✔ ' : '□ '
                    }
                    {playlistName}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>)}
        +
      </button>
    </>
  )
}

function TrackRow({ track }) {
  const { addToPlaylist, removeFromPlaylist, isFavorite } = usePlaylist()
  const { play: handlePlay } = usePlayerDispach()

  const toggleFavorite = (track) => {
    if (isFavorite(track)) {
      removeFromPlaylist({ track, playlistName: 'FAVORITE' })
    } else {
      addToPlaylist({ track, playlistName: 'FAVORITE' })
    }
  }

  return (
    <div className={styles.trackRow}>
      <button className={styles.trackPlay} onClick={() => handlePlay(track)}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 12L8 5V19L20 12Z" fill="white" />
        </svg>
      </button>

      {/*
        TODO: We should only load the cover pictures of the visible elements (+1 or +2) 
        TODO: too big images (300x300), we could crop and optimize (TinyPNG reduced size in up to 50%)
      */}
      <img src={track.cover_art} className={styles.trackCover} alt="Cover" />

      <div className={styles.trackInfo}>
        <div className={styles.trackTitle}>{track.title}</div>
        <div className={styles.trackArtist}>
          {track.main_artists.join(", ")}
        </div>
      </div>
      <button className={styles.addToFavorite} onClick={() => { toggleFavorite(track) }}>
        {isFavorite(track) ? '♥' : '♡'}
      </button>
      <AddToPlaylist track={track} />
    </div>
  );
}

export default TrackRow;
