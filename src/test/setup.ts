import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

global.MediaStream = class MediaStream {
	getTracks() {
		return [];
	}
	getAudioTracks() {
		return [];
	}
	getVideoTracks() {
		return [];
	}
	addTrack() {}
	removeTrack() {}
} as any;

beforeEach(() => {
	localStorage.clear();
});
