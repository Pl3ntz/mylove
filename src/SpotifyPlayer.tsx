import React from 'react';

export function SpotifyPlayer() {
  return (
    <iframe style="border-radius:12px" 
    src="https://open.spotify.com/embed/playlist/7i1fVTRhzG4kLhAxEzNbf7?utm_source=generator&theme=0"
    width="100%"
    height="152"
    frameBorder="0"
    allowFullScreen={false}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
    loading="lazy"
    />
  );
}



