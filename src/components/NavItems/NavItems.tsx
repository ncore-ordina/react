import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

interface NavItem {
  name: string;
  route: string;
}

interface Props {
  navItems: NavItem[];
}

export const NavItems = ({ navItems }: Props) => {
  // The useRouteMatch hook attempts to match the current URL in the same way that a <Route> would.
  // It’s mostly useful for getting access to the match data without actually rendering a <Route>.
  const match = useRouteMatch("/:route");

  return (
    <div className="flex flex-col justify-between space-y-2">
      {navItems.map((navItem) => (
        <Link key={navItem.route} to={navItem.route}>
          <span
            className={`${
              !!match && match.url === navItem.route ? "text-red-700" : ""
            }`}
          >
            {navItem.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
