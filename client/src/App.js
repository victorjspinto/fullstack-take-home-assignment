import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import logo from "./assets/logo.svg";

import TrackRow from "./components/TrackRow";
import AudioPlayer from "./components/AudioPlayer";
import Tracks from "./pages/Tracks"
import Playlists from "./pages/Playlists"
import { PlayerProvider } from "./Provider/PlayerProvider";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();

  // could be replaced to react-router so we can properly navigate between pages,
  // make the browser history work, etc.
  const [currentPage, setCurrentPage] = useState("tracks");
  const navigateTo = (page) => setCurrentPage(page);
  const isLinkActive = (page) => page === currentPage ? styles.active : '';

  // const handlePlay = (track) => setCurrentTrack(track);

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <main className={styles.app}>
          <nav>
            <img src={logo} className={styles.logo} alt="Logo" />
            <ul className={styles.menu}>
              <li>
                <a href="#" className={isLinkActive('tracks')} onClick={() => navigateTo('tracks')}>
                  Tracks
                </a>
              </li>
              <li>
                <a href="#" className={isLinkActive('playlists')} onClick={() => navigateTo('playlists')}>Playlists</a>
              </li>
            </ul>
          </nav>
          {/* {tracks.map((track, ix) => (
          <TrackRow key={ix} track={track} handlePlay={handlePlay} />
        ))} */}
          {
            currentPage === 'tracks' && <Tracks />
          }
          {
            currentPage === 'playlists' && <Playlists />
          }
        </main>
        <AudioPlayer />
      </PlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
