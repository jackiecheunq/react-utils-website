import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

interface navBarItemsType {
  link: { [path: string]: string };
}

const NavBar: React.FC<navBarItemsType> = (props) => {
  const navItems = Object.entries(props.link).map(([path, title]) => {
    return (
      <li
        className="h-full text-3xl text-purple-900 mr-28 last:mr-0"
        key={path}
      >
        <NavLink to={path}>
          {({ isActive }) => (
            <div className="h-full flex justify-center items-center relative font-bold">
              <span>{title}</span>
              {isActive && (
                <motion.div
                  className="w-full h-[4px] bg-purple-900 bottom-0 absolute"
                  layoutId="underline"
                />
              )}
            </div>
          )}
        </NavLink>
      </li>
    );
  });
  return (
    <nav className="h-full w-full shrink-0">
      <ul className="flex justify-center items-center h-full">{navItems}</ul>
    </nav>
  );
};

export default NavBar;
