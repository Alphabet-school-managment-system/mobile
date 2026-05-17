"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserDataType = {
  id?: string;
  first_name?: string;
  last_name?: string;
  phoneNumber?: string;
  email?: string;
  role?: "student" | "teacher" | "parent";
  better_auth_token?: string;
  better_auth_userId?: string;
  image?: string | null;
  skipOnboarding?: boolean;
  token?: string;
  subject_specialization?: string;
  grade?: number | string;
  section?: string;
};

export type AppData = {
  userData: UserDataType;
};

export type UserContextType = {
  userData: UserDataType;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
  clearPersistedUserData: () => Promise<void>;
  isHydrated: boolean;
};
export const defaultUserData: UserDataType = {
  id: undefined,
  first_name: undefined,
  last_name: undefined,
  phoneNumber: undefined,
  email: undefined,
  role: undefined,
  better_auth_token: undefined,
  better_auth_userId: undefined,
  image: undefined,
  skipOnboarding: false,
  token: undefined,
  subject_specialization: undefined,
  grade: undefined,
  section: undefined,
};

const USER_DATA_STORAGE_KEY = "alphabet-user-data";

export const UserContext = createContext<UserContextType>({
  userData: defaultUserData,
  setUserData: () => {},
  clearPersistedUserData: async () => {},
  isHydrated: false,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserDataType>(defaultUserData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem(
          USER_DATA_STORAGE_KEY,
        );

        if (!isMounted) {
          return;
        }

        if (storedUserData) {
          const parsedUserData = JSON.parse(
            storedUserData,
          ) as Partial<UserDataType>;

          setUserData({
            ...defaultUserData,
            ...parsedUserData,
          });
        }
      } catch (error) {
        console.warn("Failed to restore user data", error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    hydrateUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistUserData = async () => {
      try {
        const hasAnyUserData = Object.entries(userData).some(([, value]) => {
          if (typeof value === "boolean") {
            return value;
          }

          return value !== undefined && value !== null;
        });

        if (!hasAnyUserData) {
          await AsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
          return;
        }

        await AsyncStorage.setItem(
          USER_DATA_STORAGE_KEY,
          JSON.stringify(userData),
        );
      } catch (error) {
        console.warn("Failed to persist user data", error);
      }
    };

    persistUserData();
  }, [isHydrated, userData]);

  const clearPersistedUserData = async () => {
    try {
      await AsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear persisted user data", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, clearPersistedUserData, isHydrated }}
    >
      {children}
    </UserContext.Provider>
  );
};
