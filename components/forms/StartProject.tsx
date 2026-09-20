"use client";

import { useState } from "react";

export default function StartProject() {
  const [sent,setSent]=useState(false);

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if(sent) return <section><h1>Your project brief is in.</h1><p>I will review scope and next steps.</p></section>;

  return (
    <form onSubmit={submit}>
      <h1>Tell me what we are building.</h1>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <p>Custom builds are scoped based on needs and systems.</p>
      <button>Send inquiry</button>
    </form>
  );
}
