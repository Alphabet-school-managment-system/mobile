import React, { createContext, useState, type ReactNode } from "react";

export type UtilType = {
  routeTitle?: string;
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
