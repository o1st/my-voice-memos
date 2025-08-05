import type React from "react";
import { memo, useEffect } from "react";
import { Button } from "../Button/Button";
import { useAudioRecorderWithRecognition } from "./useAudioRecorderWithRecognition";

interface AudioRecorderProps {
	onAudioData: (audioBlob: Blob) => void;
	onTranscription: (text: string) => void;
	disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = memo(
	({ onAudioData, onTranscription, disabled = false }) => {
		const {
			isRecording,
			isProcessing,
			transcript,
			audioBlob,
			startRecording,
			stopRecording,
		} = useAudioRecorderWithRecognition({ lang: "en-US", onTranscription });

		useEffect(() => {
			if (audioBlob) {
				onAudioData(audioBlob);
			}
		}, [audioBlob, onAudioData]);

		return (
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-4">
					<Button
						type="button"
						onClick={isRecording ? stopRecording : startRecording}
						disabled={disabled || isProcessing}
						variant={isProcessing ? "ghost" : isRecording ? "danger" : "accent"}
					>
						{isProcessing ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-[#F4E869] border-t-transparent rounded-full animate-spin"></div>
								Processing...
							</div>
						) : isRecording ? (
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
								Stop recording
							</div>
						) : (
							<div className="flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
									role="img"
									aria-label="Microphone icon"
								>
									<title>Microphone</title>
									<path
										fillRule="evenodd"
										d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
										clipRule="evenodd"
									/>
								</svg>
								Record audio
							</div>
						)}
					</Button>
					{isRecording && (
						<div className="text-sm text-gray-600">Recording...</div>
					)}
				</div>

				{isRecording && (
					<div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 text-sm min-h-[32px]">
						{transcript || "Speak now..."}
					</div>
				)}
			</div>
		);
	},
);
