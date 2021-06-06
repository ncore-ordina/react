import React, { ReactNode } from "react";
import { ActionButton, ActionButtonType } from "../ActionButton/ActionButton";

interface Props {
  title: string;
  children: ReactNode;
  onCreateButtonClick?: () => void;
}

export function Page({ title, children, onCreateButtonClick }: Props) {
  return (
    <div className="pl-6 pr-6 divide-y divide-gray-400">
      <div className="relative" data-testid="page-header">
        <h1 className="pt-6 pb-6 text-xl"> {title}</h1>
        <div className="absolute top-0 right-0">
          {!!onCreateButtonClick && (
            <ActionButton
              key="create-btn"
              className="mt-5"
              type={ActionButtonType.CREATE}
              label="Add"
              onClick={onCreateButtonClick}
            ></ActionButton>
          )}
        </div>
      </div>
      <div className="pt-6">{children}</div>
    </div>
  );
}
