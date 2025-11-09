import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  videoId: string;
  onVideoEnd?: () => void;
}

const BASE_URL = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

export default function VideoPlayer({ videoId, onVideoEnd }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<Player | null>(null);

  const masterFileSrc = `${BASE_URL}/videos/${videoId}/playlist.m3u8`;

  const availableResolutions = [
    {
      label: '360p',
      src: `${BASE_URL}/videos/${videoId}/360p/360p.m3u8`,
    },
    {
      label: '480p',
      src: `${BASE_URL}/videos/${videoId}/480p/480p.m3u8`,
    },
    {
      label: '720p',
      src: `${BASE_URL}/videos/${videoId}/720p/720p.m3u8`,
    },
    {
      label: '1080p',
      src: `${BASE_URL}/videos/${videoId}/1080p/1080p.m3u8`,
    },
  ];

  const options = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: masterFileSrc,
        type: 'application/x-mpegURL',
      },
    ],
  };

  function handleResolutionChange(index: number) {
    if (playerRef.current) {
      const player = playerRef.current;
      const currentTime = player.currentTime();

      player.src({
        src: availableResolutions[index].src,
        type: 'application/x-mpegURL',
      });
      player.ready(() => {
        player.currentTime(currentTime);
      });
    }
  }

  React.useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options));

      availableResolutions.forEach((resolution, index) => {
        player.getChild('ControlBar')?.addChild('button', {
          controlText: resolution.label,
          className: 'vjs-visible-text',
          clickHandler: () => {
            handleResolutionChange(index);
          },
        });
      });
    } else {
      if (playerRef.current) {
        const player = playerRef.current;

        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }
  }, [videoRef, videoId]);

  React.useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.off('ended');

      if (onVideoEnd) {
        player.on('ended', onVideoEnd);
      }
    }
  }, [onVideoEnd, videoId]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
