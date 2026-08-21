import React from 'react';
import { Track } from '../../types';
import { TrackCard } from './TrackCard';

interface HorizontalTrackSliderProps {
  title: string;
  tracks: Track[];
  onSeeAll?: () => void;
}

export const HorizontalTrackSlider: React.FC<HorizontalTrackSliderProps> = ({
  title,
  tracks,
  onSeeAll
}) => {
  if (tracks.length === 0) return null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {onSeeAll && (
          <span className="section-see-all" onClick={onSeeAll}>
            See all
          </span>
        )}
      </div>

      <div className="cards-slider">
        {tracks.map(track => (
          <TrackCard key={track.id} track={track} trackList={tracks} />
        ))}
      </div>
    </section>
  );
};
