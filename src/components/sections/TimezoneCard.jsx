// TimezoneCard Component - Location and timezone display
import React from 'react';
import MicroFigure from '../../micro/MicroFigure';

const TimezoneCard = ({
  location = "Brooklyn,<br />New York",
  timezone = "GMT-5"
}) => {
  const readRef = React.useRef(null);
  const figRef = React.useRef(null);
  const teleport = (e) => {
    if (!e.target.classList?.contains('loc-jbp')) return;
    figRef.current?.go?.();
    /* and show the visitor where the teleport landed */
    const fig = document.querySelector('.card.timezone .micro-fig[data-hairline="globe"]');
    fig?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div
      id="w-node-b4038914-cd95-5e00-ab4b-a5ea4511b262-003f9adc"
      className="card timezone"
    >
      <h2 className="h2-heading timezone" onClick={teleport}>
        Based in<br />
        <span dangerouslySetInnerHTML={{ __html: location }} />
        <br />‍
        <span className="span-gray">{timezone}</span>
      </h2>

      <MicroFigure
        name="globe"
        read={false}
        readRef={readRef}
        figRef={figRef}
        clip
        style={{ width: '100%', maxWidth: 344, marginTop: 2, aspectRatio: '400 / 280', overflow: 'hidden' }}
      />

      <div
        ref={readRef}
        style={{
          marginTop: 8,
          minHeight: 18,
          fontSize: 11,
          lineHeight: 1.6,
          letterSpacing: '0.02em',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#7ee0f0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      />
    </div>
  );
};

export default TimezoneCard;
