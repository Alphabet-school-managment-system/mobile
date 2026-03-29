import { renderItemTypeBadge } from "@/app/(app)/(library)/itemTypeBadge";
import { Index as ConfirmationModal } from "@/components/confirmationModal";
import { Index as Loading } from "@/components/loading";
import Button, { buttonMode } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { useUtil } from "@/hooks/useUtil";
import { LibraryItem } from "@/models";
import { IdsContext } from "@/store/idsContext";
import {
  ConfirmationModalContext,
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/modalContext";
import { UserContext } from "@/store/userContext";
import ReadMore from "@fawazahmed/react-native-read-more";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";

type LibraryItemParams = {
  id?: string;
  item_id?: string;
  item?: string;
  libraryItem?: string;
};

const EXCLUDED_FIELDS = new Set([
  "_id",
  "id",
  "branch_id",
  "parent_id",
  "loan",
]);

const formatLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const hasDisplayValue = (value: unknown) => {
  if (value === null || typeof value === "undefined") return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && value !== null) {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return true;
};

type LibraryItemDetail = LibraryItem & {
  loan?: { _id?: string; status?: string } | null;
};

export default function Index() {
  const { getGradeLabel, get_speciality_label } = useUtil();
  const params = useLocalSearchParams<LibraryItemParams>();
  const { colors } = useTheme();
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { setModalProps } = useContext(ModalContext);
  const { setConfirmationModalProps } = useContext(ConfirmationModalContext);
  const [loading, setLoading] = useState(false);

  const itemId = useMemo(() => {
    if (params.id) return String(params.id);
    if (params.item_id) return String(params.item_id);
    const raw = params.item ?? params.libraryItem;
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as Partial<LibraryItem>;
      return parsed.id ? String(parsed.id) : undefined;
    } catch {
      return undefined;
    }
  }, [params.id, params.item_id, params.item, params.libraryItem]);

  const detailEndpoint =
    itemId && userData?.id
      ? `library-item/${itemId}?user_id=${userData.id}`
      : itemId
        ? `library-item/${itemId}`
        : "";

  const {
    data: item,
    isLoading: itemLoading,
    refetch: refetchItem,
  } = useApiQuery<LibraryItemDetail>(
    [detailEndpoint],
    detailEndpoint,
    Boolean(detailEndpoint),
  );

  const fields = useMemo(() => {
    if (!item) return [];
    return Object.entries(item).filter(
      ([key, value]) => !EXCLUDED_FIELDS.has(key) && hasDisplayValue(value),
    );
  }, [item]);

  const formatValue = (key: string, value: any) => {
    if (value === null || typeof value === "undefined" || value === "") {
      return "-";
    }

    if (key === "item_type") {
      return renderItemTypeBadge(value);
    }

    if (key === "grade") {
      const gradeLabel = getGradeLabel(Number(value));
      return gradeLabel === "-" ? String(value ?? "-") : gradeLabel;
    }

    if (key === "subject") {
      return get_speciality_label(String(value));
    }

    if (key.toLowerCase().includes("date")) {
      const formatted = dayjs(value);
      return formatted.isValid()
        ? formatted.format("MMM D, YYYY")
        : String(value);
    }

    if (typeof value === "string" && value.trim().length > 120) {
      return (
        <ReadMore
          numberOfLines={3}
          style={{ color: "white" }}
          seeMoreText="See more"
          seeLessText="See less"
          seeMoreStyle={{ color: "white", fontWeight: "600" }}
          seeLessStyle={{ color: "white", fontWeight: "600" }}
        >
          {value}
        </ReadMore>
      );
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  const { mutate: requestLoan, isPending: isRequesting } = useApiMutation(
    ["library-item-loan"],
    "library-item-loan",
    "POST",
  );

  const { mutate: cancelLoan, isPending: isCanceling } = useApiMutation(
    ["library-item-loan"],
    item?.loan?._id ? `library-item-loan/${item.loan._id}/delete` : "",
    "DELETE",
  );

  const handleRequestLoan = () => {
    if (!item?.id || !Ids?.branchId || !userData?.id) return;

    setConfirmationModalProps((prev) => ({
      ...prev,
      show: true,
      title: "Confirmation",
      content: "Do you want to reserve this item?",
      okButtonText: "Yes, reserve",
      cancelButtonText: "No",
      onOk: () => {
        setLoading(true);
        requestLoan(
          {
            body: {
              item_id: item.id,
              student_id: userData.role === "student" ? userData.id : undefined,
              teacher_id: userData.role === "teacher" ? userData.id : undefined,
              issue_date: new Date(),
              return_date: dayjs().add(7, "day").toDate(),
              status: "RESERVED",
              branchId: Ids.branchId,
            },
          },
          {
            onSuccess: (result: any) => {
              setLoading(false);
              refetchItem();
            },
            onError: () => {
              setLoading(false);
            },
          },
        );
      },
      onCancel: () => {
        setModalProps((prev: ModalPropsType) => ({
          ...defaultModalProps,
          content: <ConfirmationModal />,
          show: false,
        }));
      },
    }));

    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      content: <ConfirmationModal />,
      show: true,
      showLoadingSpin: false,
      widthPercent: 80,
    }));
  };

  const handleCancelRequest = () => {
    if (!item?.loan?._id) return;
    setLoading(true);
    cancelLoan(
      { body: {} },
      {
        onSuccess: () => {
          setLoading(false);
          refetchItem();
        },
        onError: () => {
          setLoading(false);
        },
      },
    );
  };

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: loading,
      content: undefined,
      loadingText: "Loading...",
    }));
  }, [loading, setModalProps]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-5"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {itemLoading ? (
          <View className="flex-1 items-center justify-center">
            <Loading
              loadingText="Loading item details..."
              showLoadingSpin={true}
            />
          </View>
        ) : !item ? (
          <Text className="text-center text-gray-600" variant="bodyLarge">
            No library item details available.
          </Text>
        ) : (
          <>
            <View
              className="rounded-xl p-5"
              style={{ backgroundColor: colors.primary }}
            >
              {fields.map(([key, value]) => (
                <View key={key} className="mb-4">
                  <Text className="text-white/80 mb-1" variant="titleMedium">
                    {formatLabel(key)}
                  </Text>
                  {key === "item_type" ? (
                    <View style={{ alignSelf: "flex-start" }}>
                      {renderItemTypeBadge(String(value))}
                    </View>
                  ) : (
                    (() => {
                      const formatted = formatValue(key, value);
                      return typeof formatted === "string" ? (
                        <Text className="text-white" variant="titleMedium">
                          {formatted}
                        </Text>
                      ) : (
                        formatted
                      );
                    })()
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {item ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-4 pb-6">
          {item?.loan?.status === "RESERVED" ? (
            <>
              <Button
                title="it's Pending, Cancel Request"
                onPress={handleCancelRequest}
                mode={buttonMode.CONTAINED}
                style={{
                  backgroundColor: "#dc2626",
                }}
              />
            </>
          ) : (
            <Button
              title="Reserve"
              onPress={handleRequestLoan}
              style={{ marginBottom: 0 }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}
