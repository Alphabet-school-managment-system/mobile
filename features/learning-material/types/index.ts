import { LearningMaterial, Teacher } from "@/models";
import { LearningMaterialStatusEnum } from "@/models/enums";

type LearningMaterialRowProps = {
  item: LearningMaterial;
  colors: {
    primary: string;
  };
};

type QueryMode = "base" | "search" | "filter";

type LearningMaterialDetail = LearningMaterial & {
  downloadUrl?: string;
  teacher?: Teacher;
};

const statusOptions = [
  LearningMaterialStatusEnum.DRAFT,
  LearningMaterialStatusEnum.PUBLISHED,
  LearningMaterialStatusEnum.ARCHIVED,
];

export {
  LearningMaterialDetail,
  LearningMaterialRowProps,
  QueryMode,
  statusOptions
};

