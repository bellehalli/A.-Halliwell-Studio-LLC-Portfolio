"use client";

import { useState } from "react";

export default function CapabilityPlayground(){
 const [step,setStep]=useState(1);

 return (
  <section>
   <h2>Capability Playground</h2>
   <p>Interactive booking system proof.</p>
   <p>Current step: {step}</p>
   <button onClick={()=>setStep(step+1)}>Continue</button>
  </section>
 );
}
