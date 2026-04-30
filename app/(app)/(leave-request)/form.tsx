import Button from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { DatePicker, TextInput } from "@/components/ui/textinput";
import { useApiMutation } from "@/hooks/useApi";
import { LeaveRequest } from "@/models";
import { LeaveRequestForm, leaveRequestFormSchema } from "@/schema";
import { IdsContext } from "@/store/idsContext";
import {
  defaultModalProps,
  ModalContext,
  ModalPropsType,
} from "@/store/modalContext";
import { UserContext } from "@/store/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const apiRoute = "leave-request";
  const { userData } = useContext(UserContext);
  const { Ids } = useContext(IdsContext);
  const { leaveRequest: stringfiedData } = useLocalSearchParams<{
    leaveRequest?: string;
  }>();
  const parsedData = useMemo<LeaveRequest | undefined>(
    () =>
      stringfiedData ? (JSON.parse(stringfiedData) as LeaveRequest) : undefined,
    [stringfiedData],
  );
  const form = useForm<LeaveRequestForm>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      academic_year_id: Ids?.academicYearId || "",
      [userData?.role === "student" ? "student_id" : "teacher_id"]:
        userData?.id || "",
      start_date: dayjs().toDate(),
      end_date: undefined,
      note: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const { setModalProps } = useContext(ModalContext);

  const { mutate, isPending } = useApiMutation(
    [apiRoute],
    parsedData?.id ? `${apiRoute}/${parsedData.id}/update` : apiRoute,
    parsedData?.id ? "PUT" : "POST",
  );

  const handleFormSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        start_date: values?.start_date
          ? dayjs(values.start_date).format("YYYY-MM-DD")
          : null,
        end_date: values?.end_date
          ? dayjs(values.end_date).format("YYYY-MM-DD")
          : null,
      };

      await mutate(
        { body: payload },
        {
          onSuccess: (res) => {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Leave request submitted successfully",
            });
            setTimeout(() => {
              router.push("/(app)/(leave-request)/list");
            }, 100);
          },
        },
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error}`,
      });
    }
  };

  useEffect(() => {
    if (!parsedData) return;
    reset({
      academic_year_id:
        parsedData?.academic_year_id || Ids?.academicYearId || "",
      student_id: parsedData?.student_id,
      teacher_id: parsedData?.teacher_id,
      start_date: parsedData?.start_date
        ? new Date(parsedData.start_date)
        : dayjs().toDate(),
      end_date: parsedData?.end_date
        ? new Date(parsedData.end_date)
        : undefined,
      note: parsedData?.note || "",
    });
  }, [parsedData]);

  useEffect(() => {
    setModalProps((prev: ModalPropsType) => ({
      ...defaultModalProps,
      show: isPending,
    }));
  }, [isPending]);

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-xl font-bold !my-5" variant="titleLarge">
        Write your leave request details
      </Text>
      <Text
        className="text-red-600 border-2 border-red-600 p-2 mb-4 rounded-md"
        variant="bodyMedium"
      >
        The request must be approved by the administration before the start date
        of the leave.
      </Text>
      <Controller
        control={control}
        name="start_date"
        render={({ field }) => (
          <DatePicker
            placeholder=""
            onChange={field.onChange}
            error={!!errors.start_date}
            errorMessage={errors?.start_date?.message}
            label="From when you want to start your leave ?"
            value={field.value ? new Date(field.value) : new Date()}
          />
        )}
      />
      <Controller
        control={control}
        name="end_date"
        render={({ field }) => (
          <DatePicker
            placeholder=""
            onChange={field.onChange}
            error={!!errors.end_date}
            errorMessage={errors?.end_date?.message}
            label="Until when you want to end your leave ? (optional)"
            value={field.value ? new Date(field.value) : new Date()}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field }) => (
          <TextInput
            keyboardType="default"
            placeholder="any thing you want to add about your leave request ?"
            left={undefined}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.note}
            errorMessage={errors?.note?.message}
            label="Add a note (optional)"
            multiline={true}
            numberOfLines={6}
            style={{
              minHeight: 150,
            }}
            outlineStyle={{
              minHeight: 150,
              height: 150,
            }}
            contentStyle={{
              minHeight: 130,
              textAlignVertical: "top",
              paddingTop: 12,
            }}
          />
        )}
      />

      <Button
        className="mt-4"
        title={parsedData ? "Save Changes" : "Submit"}
        onPress={handleSubmit(
          async (values) => {
            handleFormSubmit(values);
          },
          (errors) => {
            console.log(errors);
          },
        )}
      />
    </View>
  );
}
