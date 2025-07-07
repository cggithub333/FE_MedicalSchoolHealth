
import { digitalClockContent } from '@utils/clock-utils';

import { useState } from 'react';

import './StyleDigitalClock.css'; // Assuming you have a CSS file for styling

const DigitalClock = () => {

  const [ currentContent, setCurrentContent ] = useState(digitalClockContent());

  setTimeout(() => {
    setCurrentContent(digitalClockContent());
  }, 1000);

  return (
    <div className="digital-clock">
      <span className="clock-content">{currentContent}</span>
    </div>
  );
}

export default DigitalClock;