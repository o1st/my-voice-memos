import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { AudioRecorder } from "../AudioRecorder";

const mockMediaRecorder = {
	start: vi.fn(),
	stop: vi.fn(),
	stream: {
		getTracks: () => [{ stop: vi.fn() }],
	},
	ondataavailable: null as any,
	onstop: null as any,
};

const mockSpeechRecognition = {
	start: vi.fn(),
	stop: vi.fn(),
	lang: "",
	interimResults: false,
	continuous: false,
	onresult: null as any,
	onerror: null as any,
	onend: null as any,
};

const mockGetUserMedia = vi.fn();

describe("AudioRecorder", () => {
	const mockOnAudioData = vi.fn();
	const mockOnTranscription = vi.fn();

	beforeEach(() => {
		Object.defineProperty(navigator, "mediaDevices", {
			value: {
				getUserMedia: mockGetUserMedia,
			},
			configurable: true,
		});

		global.MediaRecorder = vi.fn(() => mockMediaRecorder) as any;

		Object.defineProperty(window, "webkitSpeechRecognition", {
			value: vi.fn(() => mockSpeechRecognition),
			configurable: true,
		});

		vi.clearAllMocks();
		mockGetUserMedia.mockResolvedValue({} as MediaStream);

		mockOnAudioData.mockClear();
		mockOnTranscription.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("initial render", () => {
		test("should render record button in initial state", () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			expect(button).toHaveTextContent("Record audio");
			expect(button).not.toBeDisabled();
			expect(screen.queryByText("Recording...")).not.toBeInTheDocument();
		});

		test("should render disabled button when disabled prop is true", () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
					disabled={true}
				/>,
			);

			const button = screen.getByRole("button");
			expect(button).toBeDisabled();
		});
	});

	describe("recording functionality", () => {
		test("should start recording when button is clicked", async () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
				expect(MediaRecorder).toHaveBeenCalled();
				expect(mockMediaRecorder.start).toHaveBeenCalled();
				expect(mockSpeechRecognition.start).toHaveBeenCalled();
			});

			expect(button).toHaveTextContent("Stop recording");
			expect(screen.getByText("Recording...")).toBeInTheDocument();
			expect(screen.getByText("Speak now...")).toBeInTheDocument();
		});

		test("should handle microphone access error", async () => {
			const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
			mockGetUserMedia.mockRejectedValue(new Error("Permission denied"));

			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(alertSpy).toHaveBeenCalledWith("Could not access microphone");
			});

			alertSpy.mockRestore();
		});
	});

	describe("speech recognition", () => {
		test("should update transcript when speech is recognized", async () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSpeechRecognition.start).toHaveBeenCalled();
			});

			const mockEvent = {
				resultIndex: 0,
				results: [
					{
						isFinal: false,
						0: { transcript: "Hello world" },
					},
				],
			};

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult(mockEvent);
				}
			});

			await waitFor(() => {
				expect(screen.getByText("Hello world")).toBeInTheDocument();
			});
		});

		test("should handle speech recognition error", async () => {
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSpeechRecognition.start).toHaveBeenCalled();
			});

			act(() => {
				if (mockSpeechRecognition.onerror) {
					mockSpeechRecognition.onerror({ error: "network" });
				}
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				"SpeechRecognition error:",
				"network",
			);
			consoleSpy.mockRestore();
		});
	});

	describe("processing state", () => {
		test("should register speech recognition end handler", async () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSpeechRecognition.start).toHaveBeenCalled();
				expect(mockSpeechRecognition.onend).toBeDefined();
			});
		});
	});

	describe("stop recording", () => {
		test("should stop recording when stop button is clicked", async () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");

			fireEvent.click(button);

			await waitFor(
				() => {
					expect(button).toHaveTextContent("Stop recording");
				},
				{ timeout: 100 },
			);

			fireEvent.click(button);

			expect(mockMediaRecorder.stop).toHaveBeenCalled();
			expect(mockSpeechRecognition.stop).toHaveBeenCalled();
		});
	});

	describe("audio data callback", () => {
		test("should register data available handler", async () => {
			render(
				<AudioRecorder
					onAudioData={mockOnAudioData}
					onTranscription={mockOnTranscription}
				/>,
			);

			const button = screen.getByRole("button");
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockMediaRecorder.start).toHaveBeenCalled();
				expect(mockMediaRecorder.ondataavailable).toBeDefined();
			});
		});
	});
});
