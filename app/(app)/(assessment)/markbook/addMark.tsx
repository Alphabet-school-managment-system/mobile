import Button from "@/components/ui/button";
import { ErrorMessage, TextInput } from "@/components/ui/textinput";
import { useApiMutation } from "@/hooks/useApi";
import { Mark } from "@/models";
import { MarkForm } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { studentData } from "../markbook";

type AddMarkFormProps = {
  data: studentData;
  assessmentId?: string;
  assessmentMax?: number;
  mark: Mark;
  onSuccess?: () => void;
};

export default function AddMarkForm({
  data,
  assessmentId,
  assessmentMax,
  mark,
  onSuccess,
}: AddMarkFormProps) {
  const scoreMax =
    typeof assessmentMax === "number" && !Number.isNaN(assessmentMax)
      ? assessmentMax
      : 100;

  const formSchema = useMemo(
    () =>
      z.object({
        assessment_id: z.string().uuid("Invalid assessment id"),
        student_id: z.string().uuid("Invalid student id"),
        score: z.coerce
          .number({ message: "required" })
          .min(0, "Score must be at least 0")
          .max(scoreMax, `Score cannot exceed ${scoreMax}`),
      }),
    [scoreMax],
  );

  const form = useForm<MarkForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessment_id: assessmentId ?? "",
      student_id: data?.id ?? "",
      score: mark?.score,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!assessmentId) return;
    setValue("assessment_id", assessmentId, { shouldValidate: true });
  }, [assessmentId, setValue]);

  useEffect(() => {
    setValue("student_id", data?.id ?? "", { shouldValidate: true });
    setValue("score", mark?.score, { shouldValidate: true });
  }, [data?.student?.id, mark?.score, setValue]);

  const { mutate, isPending } = useApiMutation(
    ["mark"],
    mark?.id ? `mark/${mark.id}/update` : "mark",
    mark?.score ? "PUT" : "POST",
  );

  const showFormError = (errs: FieldErrors<MarkForm>) => {
    const scoreError = errs.score?.message;
    const assessmentError = errs.assessment_id?.message;
    const studentError = errs.student_id?.message;
    const message =
      scoreError || assessmentError || studentError || "Please fix the form.";
    // Toast.show({
    //   type: "error",
    //   text1: "Validation Error",
    //   text2: String(message),
    // });
  };

  const handleCreateMark = async (values: MarkForm) => {
    const payload = {
      ...values,
      score: Number(values.score),
    };
    await mutate(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          reset({
            assessment_id: assessmentId ?? "",
            student_id: data?.student.id,
            score: undefined,
          });
          onSuccess?.();
        },
      },
    );
  };

  return (
    <View>
      <Controller
        control={control}
        name="score"
        render={({ field }) => (
          <TextInput
            keyboardType="numeric"
            placeholder="Score"
            left={undefined}
            value={
              field.value === null || typeof field.value === "undefined"
                ? ""
                : String(field.value)
            }
            onChangeText={(value) => {
              const sanitizedValue = value.replace(/[^0-9.]/g, "");
              field.onChange(
                sanitizedValue === "" ? undefined : sanitizedValue,
              );
            }}
            error={!!errors.score}
            errorMessage={errors?.score?.message}
            label="Score"
          />
        )}
      />

      {errors.assessment_id?.message ? (
        <View className="mt-3">
          <ErrorMessage message={errors.assessment_id?.message} show={true} />
        </View>
      ) : null}

      <Button
        className="mt-4"
        title={mark?.score ? "Save Changes" : "Add Mark"}
        onPress={handleSubmit(handleCreateMark, showFormError)}
        disabled={!assessmentId || isPending}
      />
    </View>
  );
}
