"use client";
import React, { createContext, useState, type ReactNode } from "react";

export type UserDataType = {
  id?: string;
  first_name?: string;
  last_name?: string;
  phoneNumber?: string;
  email?: string;
  role: "student" | "teacher" | "parent";
  better_auth_token?: string;
  better_auth_userId?: string;
  image?: string | null;
  skipOnboarding?: boolean;
  token?: string;
};

export type AppData = {
  userData: UserDataType;
};

export type UserContextType = {
  userData: UserDataType | undefined;
  setUserData: (value: UserDataType) => void;
};
export const defaultUserData: UserDataType = {
  id: undefined,
  first_name: undefined,
  last_name: undefined,
  phoneNumber: undefined,
  email: undefined,
  role: "student",
  better_auth_token: undefined,
  better_auth_userId: undefined,
  image: undefined,
  skipOnboarding: false,
  token: undefined,
};

export const UserContext = createContext<UserContextType>({
  userData: undefined,
  setUserData: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserDataType>(defaultUserData);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
