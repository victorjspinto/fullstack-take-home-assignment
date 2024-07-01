import { useMutation, useQuery, useQueryClient } from "react-query"

const getPlaylistsApiCall = async () => {
  return await fetch("http://0.0.0.0:8000/playlists/", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => (data || []))
}

const mapToPlaylist = (playlists) => {
  return (playlists || []).reduce((acc, item) => { 
    acc[item.name] = item.tracks.map(track => ({ playlistId: item.id, track })) 
    return acc
  }, { })
}

const savePlaylistsApiCall = async (playlistName, track) => {
  await fetch("http://0.0.0.0:8000/playlists/", { 
    method: "POST", 
    body: JSON.stringify({ name: playlistName, tracks: [track.id] }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

const addToPlaylistApiCall = async (playlistId, track) => {
  await fetch(`http://0.0.0.0:8000/playlists/${playlistId}/tracks/`, { 
    method: "POST", 
    body: JSON.stringify({ track_id: track.id }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

const removeFromPlaylistApiCall = async (playlistId, track) => {
  await fetch(`http://0.0.0.0:8000/playlists/${playlistId}/tracks/${track.id}/`, { 
    method: "DELETE", 
  })
}

const deletePlaylistApiCall = async (playlistId) => {
  await fetch(`http://0.0.0.0:8000/playlists/${playlistId}/`, { 
    method: "DELETE", 
  })
}

const findByPlaylistName = (playlistName) => playlist => playlist.name === playlistName

export const usePlaylist = () => {
  const queryClient = useQueryClient()
  const query = useQuery('playlists', getPlaylistsApiCall)

  const _addToPlaylist = async ({ track, playlistName }) => {
    const playlist = query.data.find(findByPlaylistName(playlistName))
    if (!playlist) return _createPlaylist({ track, playlistName })
    
    await addToPlaylistApiCall(playlist.id, track)
  }

  const _removeFromPlaylist = async ({ track, playlistName }) => {
    const playlist = query.data.find(findByPlaylistName(playlistName))
    if (!playlist) return
    if (!playlist.tracks.find((item) => item.id === track.id)) return // item does not exist in playlist

    if (playlist.tracks.length === 1) {
      // delete playlist
      return await deletePlaylistApiCall(playlist.id)
    }
    // remove track
    return await removeFromPlaylistApiCall(playlist.id, track)
  }

  const _createPlaylist = async ({ track, playlistName }) => {
    if (query.data.find(findByPlaylistName(playlistName))) { return _addToPlaylist({ track, playlistName }) }

    await savePlaylistsApiCall(playlistName, track)
  }

  const addToPlaylist = useMutation(_addToPlaylist, {
    onSuccess: () => queryClient.invalidateQueries('playlists'),
  })

  const removeFromPlaylist = useMutation(_removeFromPlaylist, {
    onSuccess: () => queryClient.invalidateQueries('playlists'),
  })

  const createPlaylist = useMutation(_createPlaylist, {
    onSuccess: () => queryClient.invalidateQueries('playlists'),
  })

  const isFavorite = (track) => {
    if (!query.data) { return false }
    return query.data.find(findByPlaylistName('FAVORITE'))?.tracks.some((item) => item.id === track.id)
  }

  const isOnPlaylist = (track, playlistName) => {
    if (!query.data) { return false }
    return query.data.find(findByPlaylistName(playlistName))?.tracks.some((item) => item.id === track.id)
  }

  return {
    playlists: mapToPlaylist(query.data),
    addToPlaylist: addToPlaylist.mutate,
    removeFromPlaylist: removeFromPlaylist.mutate,
    createPlaylist: createPlaylist.mutate,
    isFavorite,
    isOnPlaylist,
  }
}
