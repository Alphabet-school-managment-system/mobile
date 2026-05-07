import FlatList from "@/components/common/flatList";
import { LeaveRequest } from "@/models";
import { UserContext } from "@/store/providers/UserContext";
import { defaultUtilProps, UtilContext } from "@/store/providers/UtilContext";
import { useContext, useEffect } from "react";
import LeaveRequestRow from "../components/LeaveRequestRow";

export default function Index() {
  const { userData } = useContext(UserContext);
  const { setUtil } = useContext(UtilContext);

  const apiEndpoint = `leave-request/search/?${[userData?.role]}_id=${userData?.id}`;

  useEffect(() => {
    return () => {
      setUtil({
        ...defaultUtilProps,
      });
    };
  }, []);

  return (
    <FlatList<LeaveRequest>
      apiEndpoint={apiEndpoint}
      renderItem={({ item }: { item: LeaveRequest }) => (
        <LeaveRequestRow item={item} />
      )}
      header={""}
      enableFetch={true}
      emptyDataTitle={"No leave request yet."}
    />
  );
}
