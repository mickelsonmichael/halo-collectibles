"use client";

import Link from "next/link";

import useToggle from "@/hooks/useToggle";
import NavLink from "@/components/NavLink";
import Icon from "@/components/Icon";
import LoginButton from "@/components/LoginButton";
import { useLogin } from "@/hooks/LoginContext";

const Navigation = () => {
  const { isOn: menuOpen, toggle: toggleMenu } = useToggle();
  const { isLoading } = useLogin();

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row py-4 bg-white/5">
        <header className="flex mb-2 pl-4 pr-4 md:mb-auto md:pr-8">
          <Link href="/">
            <h1 className="text-xl">Halo MCC Collectibles</h1>
          </Link>

          <div className="ml-auto md:hidden">
            <button
              onClick={toggleMenu}
              className={`
                rounded-sm
                border-1
                border-white/30
                px-1
                ${menuOpen ? "bg-white/10" : ""}
            `}
            >
              <Icon name="menu" />
            </button>
          </div>
        </header>

        <nav
          className={`
            flex-grow-1
            flex-col
            gap-1
            mt-3
            md:flex
            md:flex-row
            md:mt-0
            ${menuOpen ? "flex" : "hidden"}
        `}
        >
          <ul className="flex gap-1 flex-col md:flex-row">
            <NavLink icon="award" to="/achievements">
              Achievements
            </NavLink>
            <NavLink icon="dribbble" to="/skulls">
              Skulls
            </NavLink>
            <NavLink icon="monitor" to="/terminals">
              Terminals
            </NavLink>
            <NavLink icon="smartphone" to="/data-pads">
              Data Pads
            </NavLink>
          </ul>
          <ul className="flex flex-col gap-1 md:flex-row md:ml-auto">
            <LoginButton />

            <NavLink
              to="https://github.com/mickelsonmichael/halo-collectibles"
              title="GitHub"
              newWindow
            >
              <Icon name="github" />
            </NavLink>
          </ul>
        </nav>
      </div>
      {isLoading && (
        <div className="bg-cyan-800 py-4 px-8">
          <Icon name="loader" className="mr-4 animate-spin" />
          Loading achievements
        </div>
      )}
    </div>
  );
};

export default Navigation;
