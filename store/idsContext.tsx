import React, { createContext, useState, type ReactNode } from "react";

export type IdsType = {
  branchId?: string;
  branchName?: string;
  academicYearId?: string;
};

export type IdsContextType = {
  Ids: IdsType;
  setIds: (value: IdsType) => void;
};

export const IdsContext = createContext<IdsContextType>({
  Ids: {},
  setIds: () => {},
});

export const IdsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ids, setIds] = useState<IdsType>({
    branchId: undefined,
    branchName: undefined,
    academicYearId: undefined,
  });

  return (
    <IdsContext.Provider value={{ Ids: ids, setIds }}>
      {children}
    </IdsContext.Provider>
  );
};
