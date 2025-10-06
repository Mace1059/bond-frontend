import { FileJson, FileText, Music, Table, Video, Image, type LucideIcon, CircleSlash } from "lucide-react";
import { type OutputType, OUTPUT_TYPES } from "./types";

interface TypeMeta {
  icon: LucideIcon;
}

export const OutputTypeData: Record<OutputType, TypeMeta> = {
  [OUTPUT_TYPES.json]: {
    icon: FileJson,
  },
  [OUTPUT_TYPES.pdf]: {
    icon: FileText,
  },
  [OUTPUT_TYPES.image]: {
    icon: Image,
  },
  [OUTPUT_TYPES.dataframe]: {
    icon: Table,
  },
  [OUTPUT_TYPES.video]: {
    icon: Video,
  },
  [OUTPUT_TYPES.audio]: {
    icon: Music,
  },
};