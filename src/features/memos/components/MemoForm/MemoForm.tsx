import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import { Textarea } from "../../../../components/Textarea/Textarea";
import { AudioRecorder } from "../../../../components/AudioRecorder/AudioRecorder";
import { Button } from "../../../../components/Button/Button";
import { memoSchema } from "./schema";

type MemoFormData = z.infer<typeof memoSchema> & {
  id?: string;
  createdAt?: number;
};

interface MemoFormProps {
  defaultValues?: Partial<MemoFormData>;
  onSubmit?: (data: MemoFormData) => void;
  isEdit?: boolean;
  isReadOnly?: boolean;
}

export const MemoForm: React.FC<MemoFormProps> = memo(
  ({ defaultValues, onSubmit, isEdit = false, isReadOnly = false }) => {
    const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<MemoFormData>({
      resolver: zodResolver(memoSchema),
      defaultValues,
    });

    const handleAudioTranscription = (transcribedText: string) => {
      setValue("description", transcribedText, { shouldValidate: true });
    };

    const handleAudioData = (audioBlob: Blob) => {
      // TODO: save audio
      console.log("Audio recorded:", audioBlob);
    };

    return (
      <form
        onSubmit={onSubmit ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
        className="space-y-6 w-full"
      >
        <div className="mt-2">
          <Input
            label="Title *"
            id="title"
            placeholder="Enter memo title"
            disabled={isSubmitting || isReadOnly}
            readOnly={isReadOnly}
            {...register("title")}
            error={errors.title?.message}
          />
        </div>
        <div className="mt-2">
          <Textarea
            label="Description *"
            id="description"
            placeholder="Enter memo description or record audio"
            rows={6}
            disabled={isSubmitting || isReadOnly}
            readOnly={isReadOnly}
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
        {!isReadOnly && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Or record audio to transcribe:
              </span>
            </div>
            <AudioRecorder
              onAudioData={handleAudioData}
              onTranscription={handleAudioTranscription}
              disabled={isSubmitting}
            />
          </div>
        )}
        {!isReadOnly && (
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              variant="primary"
            >
              {isEdit ? "Save changes" : "Create memo"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    );
  }
);
