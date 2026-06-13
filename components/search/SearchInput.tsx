"use client";

import { FormEvent } from "react";
import { Search, X } from "lucide-react";

interface Props {
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function SearchInput({
  query,
  setQuery,
  onClose,
  onSubmit,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-0 z-10 border-b border-white/10 bg-black/95 px-4 py-5 backdrop-blur md:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 md:gap-5">
        <Search
          size={22}
          className="shrink-0 text-white/75"
        />

        <input
          autoFocus
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search products and designers"
          className="
            min-w-0
            flex-1
            bg-transparent
            text-xl
            text-white
            outline-none
            placeholder:text-white/45
            md:text-3xl
          "
        />

        {query.trim() && (
          <button
            type="submit"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10 md:inline-flex"
          >
            Search
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white transition hover:bg-white/10"
          aria-label="Close search"
        >
          <X
            size={24}
            className="text-white"
          />
        </button>
      </div>
    </form>
  );
}
