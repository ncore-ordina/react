import React, { ReactNode, Children } from "react";
import { Menu, MenuList, MenuLink, MenuButton } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import "./ActionButtonMenu.css";

interface Props {
  children: ReactNode;
  disabled?: boolean;
}

export function ActionButtonMenu({ children, disabled = false }: Props) {
  return (
    <Menu>
      <MenuButton
        disabled={disabled}
        className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        Actions <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList className="action-button-menu">
        {Children.map(children, (child) => (
          <MenuLink className="action-button-menu__link">{child}</MenuLink>
        ))}
      </MenuList>
    </Menu>
  );
}
