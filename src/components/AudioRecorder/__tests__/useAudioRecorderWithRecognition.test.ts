import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useAudioRecorderWithRecognition } from "../useAudioRecorderWithRecognition";

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

describe("useAudioRecorderWithRecognition", () => {
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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("initial state", () => {
		test("should return initial state values", () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			expect(result.current.isRecording).toBe(false);
			expect(result.current.isProcessing).toBe(false);
			expect(result.current.transcript).toBe("");
			expect(result.current.finalTranscript).toBe("");
			expect(result.current.audioBlob).toBeNull();
			expect(typeof result.current.startRecording).toBe("function");
			expect(typeof result.current.stopRecording).toBe("function");
		});
	});

	describe("startRecording", () => {
		test("should start recording and set isRecording to true", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
			expect(MediaRecorder).toHaveBeenCalled();
			expect(mockMediaRecorder.start).toHaveBeenCalled();
			expect(mockSpeechRecognition.start).toHaveBeenCalled();
			expect(result.current.isRecording).toBe(true);
		});

		test("should configure speech recognition with provided language", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "ru-RU" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(mockSpeechRecognition.lang).toBe("ru-RU");
			expect(mockSpeechRecognition.interimResults).toBe(true);
			expect(mockSpeechRecognition.continuous).toBe(true);
		});

		test("should handle getUserMedia error", async () => {
			const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});
			mockGetUserMedia.mockRejectedValue(new Error("Permission denied"));

			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				"Audio recording error:",
				expect.any(Error),
			);
			expect(alertSpy).toHaveBeenCalledWith("Could not access microphone");
			expect(result.current.isRecording).toBe(false);

			alertSpy.mockRestore();
			consoleSpy.mockRestore();
		});

		test("should reset transcript and audio blob when starting new recording", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult({
						resultIndex: 0,
						results: [{ isFinal: true, 0: { transcript: "test" } }],
					});
				}
			});

			await waitFor(() => {
				expect(result.current.transcript).toContain("test");
			});

			await act(async () => {
				await result.current.startRecording();
			});

			expect(result.current.transcript).toBe("");
			expect(result.current.audioBlob).toBeNull();
		});
	});

	describe("stopRecording", () => {
		test("should stop recording and set isRecording to false", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(result.current.isRecording).toBe(true);

			act(() => {
				result.current.stopRecording();
			});

			expect(mockMediaRecorder.stop).toHaveBeenCalled();
			expect(mockSpeechRecognition.stop).toHaveBeenCalled();
			expect(result.current.isRecording).toBe(false);
		});

		test("should not throw error when stopping without recording", () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			expect(() => {
				act(() => {
					result.current.stopRecording();
				});
			}).not.toThrow();
		});
	});

	describe("speech recognition events", () => {
		test("should handle interim transcript results", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult({
						resultIndex: 0,
						results: [{ isFinal: false, 0: { transcript: "hello" } }],
					});
				}
			});

			expect(result.current.transcript).toBe("hello");
			expect(result.current.finalTranscript).toBe("");
		});

		test("should handle final transcript results", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult({
						resultIndex: 0,
						results: [{ isFinal: true, 0: { transcript: "hello world" } }],
					});
				}
			});

			expect(result.current.transcript).toBe("hello world");
			expect(result.current.finalTranscript).toBe("hello world");
		});

		test("should accumulate multiple final results", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult({
						resultIndex: 0,
						results: [{ isFinal: true, 0: { transcript: "hello " } }],
					});
				}
			});

			act(() => {
				if (mockSpeechRecognition.onresult) {
					mockSpeechRecognition.onresult({
						resultIndex: 1,
						results: [
							{ isFinal: true, 0: { transcript: "hello " } },
							{ isFinal: true, 0: { transcript: "world" } },
						],
					});
				}
			});

			expect(result.current.finalTranscript).toBe("hello world");
		});

		test("should handle speech recognition error", async () => {
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
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

	describe("audio processing", () => {
		test("should set processing state when recording ends", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			act(() => {
				if (mockSpeechRecognition.onend) {
					mockSpeechRecognition.onend();
				}
			});

			expect(result.current.isProcessing).toBe(true);
		});

		test("should register data available handler", async () => {
			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(mockMediaRecorder.ondataavailable).toBeDefined();
		});
	});

	describe("environment without speech recognition", () => {
		test("should work without speech recognition API", async () => {
			delete (window as any).webkitSpeechRecognition;
			delete (window as any).SpeechRecognition;

			const { result } = renderHook(() =>
				useAudioRecorderWithRecognition({ lang: "en-US" }),
			);

			await act(async () => {
				await result.current.startRecording();
			});

			expect(mockGetUserMedia).toHaveBeenCalled();
			expect(mockMediaRecorder.start).toHaveBeenCalled();
			expect(result.current.isRecording).toBe(true);
		});
	});
});
