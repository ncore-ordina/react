import { Menu, MenuButton, MenuItem, MenuPopover } from "@reach/menu-button";
import { UserIcon } from "../Icons/User";
import React from "react";
import { UserInfo } from "./UserInfo";

interface Props {
  login: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  userName?: string;
  tokenExpiresAt?: number;
}

export const UserMenu = ({
  login,
  userName,
  isAuthenticated,
  tokenExpiresAt,
  logout,
}: Props) => (
  <Menu>
    <MenuButton>
      <UserIcon />
    </MenuButton>
    {!!isAuthenticated() ? (
      <MenuPopover className="bg-white border-2">
        <UserInfo name={userName!} expiresAt={tokenExpiresAt!} />
        <MenuItem onSelect={logout}>Logout</MenuItem>
      </MenuPopover>
    ) : (
      <MenuPopover className="bg-white border-2">
        <MenuItem onSelect={login}>Login</MenuItem>
      </MenuPopover>
    )}
  </Menu>
);
