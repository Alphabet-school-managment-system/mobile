import { AcademicYear } from "@/models";
import React, { createContext, useState, type ReactNode } from "react";

export type UtilType = {
  routeTitle?: string;
  serverDate?: string;
  acadamic_year?: AcademicYear;
  onHeaderRightPress?: () => void;
};

export type UtilContextType = {
  Util: UtilType;
  setUtil: (value: UtilType) => void;
};

export const UtilContext = createContext<UtilContextType>({
  Util: {},
  setUtil: () => {},
});

export const defaultUtilProps: UtilType = {
  routeTitle: undefined,
  serverDate: undefined,
  acadamic_year: undefined,
  onHeaderRightPress: undefined,
};

export const UtilProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [util, setUtil] = useState<UtilType>({
    ...defaultUtilProps,
  });

  return (
    <UtilContext.Provider value={{ Util: util, setUtil }}>
      {children}
    </UtilContext.Provider>
  );
};
