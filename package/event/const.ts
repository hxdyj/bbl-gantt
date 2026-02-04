export const EventBusEventName = {
	init: 'init',
	container_scroll: 'container_scroll',

	header_wheel: 'header_wheel',


	event_item_body_mouse_down: 'event_item_body_mouse_down',
	event_item_body_mouse_enter: 'event_item_body_mouse_enter',
	event_item_body_mouse_over: 'event_item_body_mouse_over',
	event_item_body_mouse_move: 'event_item_body_mouse_move',
	event_item_body_mouse_leave: 'event_item_body_mouse_leave',
	event_item_body_context_menu: 'event_item_body_context_menu',
	event_item_body_click: 'event_item_body_click',
	event_item_left_resize_mouse_down: 'event_item_left_resize_mouse_down',
	event_item_right_resize_mouse_down: 'event_item_right_resize_mouse_down',

	event_item_add: 'event_item_add',
	event_item_delete: 'event_item_delete',



	row_click: 'row_click',
	row_delete: 'row_delete',

} as const

export type EventBusEventNameType = typeof EventBusEventName[keyof typeof EventBusEventName]
