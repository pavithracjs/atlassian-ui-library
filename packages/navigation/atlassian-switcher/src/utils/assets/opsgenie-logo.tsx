import * as React from 'react';

const style = `
.opsgenie-cls-1{fill:#fff;}
.opsgenie-cls-2{fill:url(#linear-gradient);}
.opsgenie-cls-3{fill:url(#linear-gradient-2);}
`;

export default () => {
  return (
    <svg width="20" height="20" viewBox="0 0 60 72">
      <defs>
        <style>{style}</style>
        <linearGradient
          id="linear-gradient"
          x1="30.03"
          y1="6.57"
          x2="30.03"
          y2="43.2"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.15" stopColor="#fff" stopOpacity="0.98" />
          <stop offset="0.31" stopColor="#fff" stopOpacity="0.93" />
          <stop offset="0.48" stopColor="#fff" stopOpacity="0.84" />
          <stop offset="0.66" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="0.84" stopColor="#fff" stopOpacity="0.56" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="19.05"
          y1="42.17"
          x2="31.32"
          y2="67.85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <circle className="opsgenie-cls-2" cx="30.03" cy="18.48" r="17.84" />
          <path
            className="opsgenie-cls-3"
            d="M28.51,71.7A86.06,86.06,0,0,1,.26,42.17a2,2,0,0,1,.87-2.77l13.51-6.63a2,2,0,0,1,2.61.8,66.79,66.79,0,0,0,29,26.25A86.5,86.5,0,0,1,31.55,71.7,2.87,2.87,0,0,1,28.51,71.7Z"
          />
          <path
            className="opsgenie-cls-1"
            d="M31.55,71.7A86,86,0,0,0,59.8,42.17a2,2,0,0,0-.86-2.77L45.42,32.77a2,2,0,0,0-2.61.8,66.76,66.76,0,0,1-29,26.25A86,86,0,0,0,28.51,71.7,2.87,2.87,0,0,0,31.55,71.7Z"
          />
        </g>
      </g>
    </svg>
  );
};
