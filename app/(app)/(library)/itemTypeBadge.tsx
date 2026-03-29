import { Text } from "@/components/ui/text";
import { View } from "react-native";

const itemTypeStyles: Record<
  string,
  { bgColor: string; textColor: string; label: string }
> = {
  book: { bgColor: "#dbeafe", textColor: "#1d4ed8", label: "Book" },
  magazine: { bgColor: "#fef3c7", textColor: "#92400e", label: "Magazine" },
  journal: { bgColor: "#ede9fe", textColor: "#6d28d9", label: "Journal" },
  e_book: { bgColor: "#dcfce7", textColor: "#15803d", label: "E-Book" },
  audio_book: {
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
    label: "Audio Book",
  },
  reference_book: {
    bgColor: "#ffe4e6",
    textColor: "#be123c",
    label: "Reference Book",
  },
  other: { bgColor: "#f3f4f6", textColor: "#374151", label: "Other" },
};

export const renderItemTypeBadge = (itemType?: string) => {
  const key = (itemType ?? "other").toLowerCase();
  const style = itemTypeStyles[key] ?? itemTypeStyles.other;

  return (
    <View
      className="rounded-md px-3 py-2"
      style={{ backgroundColor: style.bgColor }}
    >
      <Text
        className="text-xs font-semibold"
        style={{ color: style.textColor, textTransform: "uppercase" }}
      >
        {style.label}
      </Text>
    </View>
  );
};
