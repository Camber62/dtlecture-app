import React from 'react';
import { ApiFetchConfigResponse } from '../../types/api';

interface ProgressBarProps {
  config: ApiFetchConfigResponse;
  currentBlockId: string | number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ config, currentBlockId }) => {
  const { blocks } = config;


  const currentIndex = blocks.findIndex((block) => block.id === currentBlockId);
  const progressPercentage = currentIndex !== -1 ? ((currentIndex + 1) / blocks.length) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.progress, width: `${progressPercentage}%` }} />
    </div>
  );
};

const styles = {
  container: {
    height: '15px',
    width: '100%',
    backgroundColor: '#7e838c',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative' as 'relative',
    marginTop: '10px',
  },
  progress: {
    height: '100%',
    backgroundColor: '#b1fa00',
    transition: 'width 0.3s ease',
  },
};

export default ProgressBar;
