"use client";

import { useState } from "react";

import { type StepFormProps } from "~/app/utils/shared-types";

export default function SendNoteForm({ goNext, goBack }: StepFormProps) {
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">send a note to the couple?</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="h-40 border p-3"
      />
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goNext && goNext()}
      >
        CONTINUE
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goNext && goNext()}
      >
        SKIP
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goBack && goBack()}
      >
        BACK
      </button>
    </div>
  );
}
