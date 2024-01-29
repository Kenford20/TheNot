"use client";

import { useState } from "react";

export default function SendNoteForm() {
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">send a note to the couple?</h2>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() =>
          console.log("invoke function to move to next step of form")
        }
      >
        CONTINUE
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
      >
        SKIP
      </button>
    </div>
  );
}
