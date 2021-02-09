import React from "react";
import CoinsIcon from "stablecoin-icons";

export const InterestToken = ({ name }) => (
  <>
    <svg viewBox="0 0 412 113" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M371 60H84V62H371V60Z" fill="#E6E6E6" />
      <path
        d="M3.48259 0C2.55926 0.00091128 1.67404 0.330913 1.02114 0.917614C0.368249 1.50431 0.0010141 2.29979 0 3.1295V109.87C0.0010141 110.7 0.368249 111.496 1.02114 112.082C1.67404 112.669 2.55926 112.999 3.48259 113H408.517C409.441 112.999 410.326 112.669 410.979 112.082C411.632 111.496 411.999 110.7 412 109.87V3.1295C411.999 2.29979 411.632 1.50431 410.979 0.917614C410.326 0.330913 409.441 0.00091128 408.517 0H3.48259Z"
        fill="#E6E6E6"
      />
      <path d="M9 104H404V9H9V104Z" fill="white" />
      <svg>
        <CoinsIcon x="20" y="29" type={2} symbol={name} width="55" height="55" />
      </svg>
      <path
        d="M373.167 91C372.062 91 371.002 91.4214 370.22 92.1716C369.439 92.9217 369 93.9391 369 95C369 96.0609 369.439 97.0783 370.22 97.8284C371.002 98.5786 372.062 99 373.167 99H389.833C390.938 99 391.998 98.5786 392.78 97.8284C393.561 97.0783 394 96.0609 394 95C394 93.9391 393.561 92.9217 392.78 92.1716C391.998 91.4214 390.938 91 389.833 91H373.167Z"
        fill="#0037FF"
      />
      <path d="M81 92.4999C265 84 314 82.5 381.5 40.5" stroke="black" />
    </svg>
  </>
);
