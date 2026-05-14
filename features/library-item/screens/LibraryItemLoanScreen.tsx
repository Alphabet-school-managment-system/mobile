import { Index as Loading } from "@/components/common/loading";
import { Index as Menu, MenuItemtype } from "@/components/common/menu";
import { Text } from "@/components/ui/text";
import { Index as TouchableOpacity } from "@/components/ui/touchableOpacity";
import { Index as LibraryItemTypeBadge } from "@/features/library-item/components/LibraryItemTypeBadge";
import { useApiQuery } from "@/hooks/useApi";
import { LibraryItem, LibraryItemLoan } from "@/models";
import { BottomSheetContext } from "@/store/providers/BottomSheetContext";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext } from "@/store/providers/UserContext";
import Entypo from "@expo/vector-icons/Entypo";
import ReadMore from "@fawazahmed/react-native-read-more";
import dayjs from "dayjs";
import { useContext, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

type LoanWithItem = LibraryItemLoan & {
  libraryitem?: LibraryItem | null;
};

type LoanStatusFilter =
  | "BORROWED"
  | "RESERVED"
  | "RETURNED"
  | "OVERDUE"
  | undefined;

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : String(value);
};

const getStatusStyle = (status?: string) => {
  switch ((status ?? "").toUpperCase()) {
    case "BORROWED":
      return { label: "Borrowed", color: "#2563eb" };
    case "RESERVED":
      return { label: "Reserved", color: "#d97706" };
    case "RETURNED":
      return { label: "Returned", color: "#16a34a" };
    case "OVERDUE":
      return { label: "Overdue", color: "#dc2626" };
    default:
      return { label: status ?? "-", color: "#6b7280" };
  }
};

export default function Index() {
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { openBottomSheet } = useContext(BottomSheetContext);
  const [activeStatus, setActiveStatus] = useState<LoanStatusFilter>(undefined);

  const searchEndpoint = useMemo(() => {
    if (!userData?.id) return "";
    const params = new URLSearchParams();

    if (userData.role === "student") {
      params.set("student_id", userData.id);
    }

    if (userData.role === "teacher") {
      params.set("teacher_id", userData.id);
    }

    if (activeStatus !== undefined) {
      params.set("status", activeStatus);
    }

    if (Ids?.branchId) {
      params.set("branch_id", Ids.branchId);
    }

    const andFields: string[] = [];
    if (userData.role === "student") andFields.push("student_id");
    if (userData.role === "teacher") andFields.push("teacher_id");
    if (activeStatus !== undefined) andFields.push("status");
    if (Ids?.branchId) andFields.push("branch_id");
    if (andFields.length > 0) {
      params.set("__and", andFields.join(","));
    }

    const query = params.toString();

    return query ? `library-item-loan/search?${query}` : "";
  }, [userData?.id, userData?.role, activeStatus, Ids?.branchId]);

  const {
    data: loans = [],
    isLoading,
    isSuccess,
  } = useApiQuery<LoanWithItem[]>(
    [searchEndpoint],
    searchEndpoint,
    Boolean(searchEndpoint),
  );

  const openLoanDetails = (loan: LoanWithItem) => {
    const item = loan.libraryitem;
    const statusMeta = getStatusStyle(loan.status);

    openBottomSheet({
      title: item?.title ?? "Loan Details",
      fitToContents: true,
      children: (
        <View className="gap-4 mb-4">
          <View className="rounded-xl border border-gray-200 p-4">
            <Text className="text-gray-500 mb-2" variant="labelLarge">
              Loan Info
            </Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text variant="bodyMedium">Status</Text>
                <Text style={{ color: statusMeta.color }} variant="titleMedium">
                  {statusMeta.label}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text variant="bodyMedium">Issue date</Text>
                <Text variant="bodyMedium">{formatDate(loan.issue_date)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text variant="bodyMedium">Return date</Text>
                <Text variant="bodyMedium">{formatDate(loan.return_date)}</Text>
              </View>

              {loan?.note && (
                <View className="flex-col">
                  <Text variant="bodyMedium">Note</Text>
                  <ReadMore
                    numberOfLines={1}
                    seeMoreText="See more"
                    seeLessText="See less"
                    seeMoreStyle={{ fontWeight: "600" }}
                    seeLessStyle={{ fontWeight: "600" }}
                  >
                    {loan?.note}
                  </ReadMore>
                </View>
              )}
            </View>
          </View>
        </View>
      ),
    });
  };

  const renderItem = ({ item }: { item: LoanWithItem }) => {
    return (
      <TouchableOpacity
        onPress={() => openLoanDetails(item)}
        className="border border-gray-200 rounded-lg px-4 py-3 mb-3 flex-row justify-between"
      >
        <View className="flex-1 pr-3">
          <Text className="text-gray-900 font-semibold" variant="titleMedium">
            {item.libraryitem?.title ?? "Unknown title"}
          </Text>
          <Text className="text-gray-500" variant="bodySmall">
            {item.libraryitem?.author ?? "Unknown author"}
          </Text>
        </View>
        <View className="items-end justify-center">
          {item.libraryitem?.item_type ? (
            <View className="mt-2">
              {LibraryItemTypeBadge(item.libraryitem.item_type)}
            </View>
          ) : (
            <View className="h-6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const statusLabel =
    activeStatus === "BORROWED"
      ? "Borrowed"
      : activeStatus === "RESERVED"
        ? "Reserved"
        : activeStatus === "RETURNED"
          ? "Returned"
          : activeStatus === "OVERDUE"
            ? "Overdue"
            : "All Loans";

  const statusMenuItems = useMemo<MenuItemtype[]>(
    () => [
      {
        title: "All",
        leadingIcon:
          activeStatus === undefined
            ? "check-circle-outline"
            : "view-list-outline",
        onPress: () => setActiveStatus(undefined),
      },
      {
        title: "Borrowed",
        leadingIcon:
          activeStatus === "BORROWED" ? "check-circle-outline" : "book-outline",
        onPress: () => setActiveStatus("BORROWED"),
      },
      {
        title: "Reserved",
        leadingIcon:
          activeStatus === "RESERVED"
            ? "check-circle-outline"
            : "bookmark-outline",
        onPress: () => setActiveStatus("RESERVED"),
      },
      {
        title: "Returned",
        leadingIcon:
          activeStatus === "RETURNED" ? "check-circle-outline" : "check-bold",
        onPress: () => setActiveStatus("RETURNED"),
      },
      {
        title: "Overdue",
        leadingIcon:
          activeStatus === "OVERDUE"
            ? "check-circle-outline"
            : "calendar-alert",
        onPress: () => setActiveStatus("OVERDUE"),
      },
    ],
    [activeStatus],
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={loans}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="pt-4 pb-2">
            <View className="mb-2 flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <View>
                <Text variant="titleMedium">{statusLabel}</Text>
              </View>
              <View className="rounded-full px-1 py-1">
                <Menu
                  items={statusMenuItems}
                  headerTitle="Loan Status"
                  icon={<Entypo name="select-arrows" size={22} color="gray" />}
                />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            {isLoading ? (
              <Loading
                loadingText="Loading your library loans..."
                showLoadingSpin={true}
              />
            ) : isSuccess ? (
              <Text className="text-gray-500" variant="bodyMedium">
                No library loans found.
              </Text>
            ) : (
              <Text className="text-gray-500" variant="bodyMedium">
                Your library loans will appear here.
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
