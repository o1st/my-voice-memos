import { useCallback, useRef, useState } from "react";

interface UseAudioRecorderWithRecognitionProps {
	lang?: string;
	onTranscription?: (text: string) => void;
}

export function useAudioRecorderWithRecognition({
	lang = "en-US",
	onTranscription,
}: UseAudioRecorderWithRecognitionProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [interimTranscript, setInterimTranscript] = useState("");
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const recognitionRef = useRef<any>(null);
	const transcriptRef = useRef("");
	const interimTranscriptRef = useRef("");

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);

			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			setTranscript("");
			setInterimTranscript("");

			transcriptRef.current = "";
			interimTranscriptRef.current = "";

			setAudioBlob(null);

			const SpeechRecognition =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition;

			if (SpeechRecognition) {
				const recognition = new SpeechRecognition();

				recognition.lang = lang;
				recognition.interimResults = true;
				recognition.continuous = true;
				recognitionRef.current = recognition;

				recognition.onresult = (event: any) => {
					let finalTranscript = "";
					let interimTranscript = "";

					for (let i = event.resultIndex; i < event.results.length; ++i) {
						if (event.results[i].isFinal) {
							finalTranscript += event.results[i][0].transcript;
						} else {
							interimTranscript += event.results[i][0].transcript;
						}
					}

					if (finalTranscript) {
						transcriptRef.current += finalTranscript;
						setTranscript(transcriptRef.current);

						interimTranscriptRef.current = "";
						setInterimTranscript("");
					} else {
						interimTranscriptRef.current = interimTranscript;
						setInterimTranscript(interimTranscript);
					}
				};

				recognition.onerror = (event: any) => {
					console.error("SpeechRecognition error:", event.error);
				};

				recognition.onend = () => {
					setIsProcessing(true);

					setTimeout(() => {
						setIsProcessing(false);
						if (audioChunksRef.current.length > 0) {
							const audioBlob = new Blob(audioChunksRef.current, {
								type: "audio/wav",
							});
							setAudioBlob(audioBlob);
							if (onTranscription) {
								onTranscription(transcriptRef.current);
							}
						}
					}, 300);
				};

				recognition.start();
			}

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				if (recognitionRef.current) {
					recognitionRef.current.stop();
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Audio recording error:", error);
			alert("Could not access microphone");
		}
	}, [lang, onTranscription]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
		}

		if (recognitionRef.current) {
			recognitionRef.current.stop();
		}
	}, [isRecording]);

	return {
		isRecording,
		isProcessing,
		transcript: transcript + interimTranscript,
		finalTranscript: transcript,
		audioBlob,
		startRecording,
		stopRecording,
	};
}
