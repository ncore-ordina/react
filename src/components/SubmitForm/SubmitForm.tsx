import React, { MouseEvent } from "react";

interface Props {
  isDisabled: boolean;
  onCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function SubmitForm({ isDisabled, onCancel }: Props) {
  return (
    <div className="flex items-center">
      <div className="md:w-1/4" />
      <div className="md:w-3/4 flex">
        <div>
          <button
            disabled={isDisabled}
            type="submit"
            className={`bg-primary-500 text-white font-bold py-2 px-4 rounded
          ${
            isDisabled
              ? " opacity-50 cursor-not-allowed"
              : "hover:bg-primary-700"
          }`}
          >
            Save
          </button>
        </div>
        {onCancel ? (
          <button
            type="button"
            className="bg-transparent hover:bg-primary-700 border border-primary-500 ml-4 py-2 px-4 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
