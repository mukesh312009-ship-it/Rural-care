import React from 'react';
import { QueueToken } from '../../types';

interface LiveTokenDisplayProps {
  currentCallingToken?: string;
  myToken?: QueueToken;
}

export const LiveTokenDisplay: React.FC<LiveTokenDisplayProps> = ({
  currentCallingToken = 'PHC-OPD-012',
  myToken,
}) => {
  return (
    <div className="p-4 bg-teal-800 text-white rounded-2xl flex items-center justify-between">
      <div>
        <span className="text-xs uppercase text-teal-300 font-bold">Now Calling</span>
        <div className="text-3xl font-black">{currentCallingToken}</div>
      </div>
      {myToken && (
        <div className="text-right">
          <span className="text-xs text-teal-300 font-bold">Your Token</span>
          <div className="text-xl font-bold">{myToken.token_code}</div>
        </div>
      )}
    </div>
  );
};
