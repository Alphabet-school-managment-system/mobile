import { router } from "expo-router";
import React, { ReactElement } from "react";
import { View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { Text } from "./text";

type MenuItem = {
  icon: ReactElement;
  title: string;
  route: string;
};

type Props = {
  label?: string;
  menus: MenuItem[];
};

function chunk<T>(arr: T[], size = 2): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

export default function MenuRow({ label, menus }: Props) {
  const rows = chunk(menus, 2);
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 20 }}>
      {label && (
        <View className="!my-5 !mx-3 p-4 bg-gray-100 rounded-md">
          <Text className="!text-xl !font-normal  text-gray-700">{label}</Text>
        </View>
      )}

      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className={`flex-row gap-2 mx-4 ${rowIndex > 0 ? "mt-3" : ""}`}
        >
          {row.map((item, index, last) => {
            const isSingle = row.length === 1;
            return (
              <Card
                key={index}
                className={`${isSingle ? "w-full" : `w-1/2 ${last ? "mr-0" : "mr-4"}`} `}
                onPress={() => router.replace(item.route as any)}
                contentStyle={{ padding: 0, borderRadius: 0 }}
                mode="elevated"
                style={{ backgroundColor: colors.primary }}
              >
                <Card.Content className="justify-center items-center py-5 !rounded-none ">
                  {item.icon}
                  <Text className="mt-2 !text-xl font-bold !text-white">
                    {item.title}
                  </Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      ))}
    </View>
  );
}
