import React from 'react';

export function SpotifyPlayer() {
  return (
    <iframe
      style={{ borderRadius: '12px' }}
      src="https://open.spotify.com/embed/playlist/SUA_PLAYLIST_ID?utm_source=generator"
      width="300"
      height="380"
      frameBorder="0"
      allowFullScreen={false}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  );
}
