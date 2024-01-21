import React, { useState } from "react";
import { Avatar, Menu } from "@mantine/core";

const ProfileMenu = ({ user, logout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Menu open={isDropdownOpen} onToggle={() => setDropdownOpen(!isDropdownOpen)}>
      <Menu.Target>
        <Avatar src={user?.picture} alt="user image" radius={"lg"} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Favourites</Menu.Item>
        <Menu.Item>Bookings</Menu.Item>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
