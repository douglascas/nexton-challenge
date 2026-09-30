## Dynamic form test

## Goal

Build a Request Submission dynamic form app based on provided design and technical

requirements. :

## Flow of the app

## Design Material

Mockups: https://www.figma.com/design/fb4dBUg7pffTlQmrPQNivv/Front-end-Engine [URL 🔗](https://www.figma.com/design/fb4dBUg7pffTlQmrPQNivv/Front-end-Engineer-Task?node-id=0-1&t=mnO5PVpaD7rHHjA7-1)

[er-Task?node-id=0-1&t=mnO5PVpaD7rHHjA7-1](https://www.figma.com/design/fb4dBUg7pffTlQmrPQNivv/Front-end-Engineer-Task?node-id=0-1&t=mnO5PVpaD7rHHjA7-1)

Design System: https://www.figma.com/design/ybuM0rl38f6qlcSGlKwdLK/Design-System-- Temporary-?node-id=4597-2136&t=f5c07LgPuLykOHOs-1 [URL 🔗](https://www.figma.com/design/ybuM0rl38f6qlcSGlKwdLK/Design-System--Temporary-?node-id=4597-2136&t=f5c07LgPuLykOHOs-1)

Password: Procurement

## Flow Details

- \- First gives you a choice between the 2 schemas (see below).

- \- On choosing one of them (software or hardware), it should move you to a new page where the user can fill out a new request form based on the schema

- \- Each schema section should be on a separate page.

- \- User can navigate between pages using a “Next” and “Previous” button

- \- In the final page/section of the schema, it should show a “Submit” button instead of “Next”.

- \- “Next” and “Submit” should be blocked if input is invalid while highlighting where the error is.

- \- After Submit, show a read-only summary and a single “Create New Request” button that resets to the schema chooser.

- \- The routes/URLs used are up to you.

## Acceptance Criteria

- \- Follow the mockups for a general direction and main styling decisions.

- \- Keep styling minimal. Focus on Reactive Forms + RxJS.

## Schemas

- \- 1st schema

```
{
	"id": "software-request",
	"title": "Software Request",
	"sections": [
		{
			"id": "requested-item",
			"title": "Requested Item",
			"fields": [
				{
					"id": 1758177604,
					"label": "Item Name",
					"type": "text",
					"required": true
				},
				{
					"id": 75484637462,
					"label": "Quantity",
					"type": "number",
					"required": true
				}
			]
		},
		{
			"id": "vendor-info",
			"title": "Vendor Information",
			"fields": [
				{
					"id": 4957463729,
					"label": "Vendor Name",
					"type": "text",
					"required": true
				},
				{
					"id": 8462736152,
					"label": "Vendor Location",
					"type": "radio",
					"required": true,
					"options": [
						"USA",
						"UK",
						"Other"
					]
				},
				{
					"id": 6482937561,
					"label": "Website",
					"type": "text",
					"required": false
				}
			]
		}
	]
}
```

## \- 2nd schema

```
"id": "hardware-request",
"title": "Hardware Request",
"sections": [
	{
		"id": "requested-item",
		"title": "Requested Item",
		"fields": [
			{
				"id": 75329829348985,
				"label": "Item Name",
				"type": "text",
				{
					"required": true
				},
				{
					"id": 85781623672346,
					"label": "Quantity",
					"type": "number",
					"required": false
				},
				{
					"id": 2389182391823812,
					"label": "Requires shipping",
					"type": "toggle",
					"default": false
				}
			]
		},
		{
			"id": "vendor-info",
			"title": "Vendor Information",
			"fields": [
				{
					"id": 9542834823423,
					"label": "Vendor Name",
					"type": "text",
					"required": true
				},
				{
					"id": 5587934758234,
					"label": "Vendor Location",
					"type": "radio",
					"required": true,
					"options": [
						"USA",
						"UK",
						"Other"
					]
				}
			]
		}
	]
}
```

## Requirements

- Angular 16+ (standalone components or NgModules are both fine).

- Reactive Forms (no template-driven).

- Autosave - user input should auto save at a reasonable interval

- Display save state: Saving…, Saved, Error – retrying….

- Mock API locally (no network required):

- You can use Angular’s in-memory-web-api, MSW, or a simple RxJS fake service with delay/throwError.

- No state libraries required; HttpClient + RxJS is enough.

- Basic error handling & retry(1–2) on autosave failures.

- Allowed field types: text | number | radio | toggle.

- All fields and sections should be dynamic, and assumes that the schema’s sections, questions and their properties can change.

## Mock API (expected contract)

## Required mock service functions (API mock):

- PUT /api/requests/:id/question/:questionId

- GET /api/schemas → returns both schemas

Note that no actual server nor API URL usage is needed. This is just to communicate the

expected HTTP calls that need to be mocked.

## Specs:

- \- Important: Simulate latency 600–1000ms on PUT. i.e. saving the answers

- \- Add random failures (10–20%) to exercise error paths.
