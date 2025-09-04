"use client";

import React from "react";

type StarBurstProps = {
  size?: number;
};

const StarBurst: React.FC<StarBurstProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <g fill="none" stroke="rgba(255,255,200,0.9)" strokeWidth="1">
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4M4.2 4.2l2.8 2.8M16.9 16.9l2.8 2.8M4.2 19.8l2.8-2.8M16.9 7.1l2.8-2.8"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default StarBurst;
