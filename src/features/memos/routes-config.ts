export const ROUTES = {
	LIST: "/memos",
	NEW: "/memos/new",
	VIEW: "/memos/:id",
	EDIT: "/memos/:id/edit",
} as const;

export const buildUrl = {
	list: () => ROUTES.LIST,
	new: () => ROUTES.NEW,
	view: (id: string) => ROUTES.VIEW.replace(":id", id),
	edit: (id: string) => ROUTES.EDIT.replace(":id", id),
} as const;
