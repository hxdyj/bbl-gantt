export declare const EventBusEventName: {
    readonly init: "init";
    readonly container_scroll: "container_scroll";
    readonly header_wheel: "header_wheel";
    readonly event_item_body_mouse_down: "event_item_body_mouse_down";
    readonly event_item_body_mouse_enter: "event_item_body_mouse_enter";
    readonly event_item_body_mouse_over: "event_item_body_mouse_over";
    readonly event_item_body_mouse_move: "event_item_body_mouse_move";
    readonly event_item_body_mouse_leave: "event_item_body_mouse_leave";
    readonly event_item_body_context_menu: "event_item_body_context_menu";
    readonly event_item_body_click: "event_item_body_click";
    readonly event_item_left_resize_mouse_down: "event_item_left_resize_mouse_down";
    readonly event_item_right_resize_mouse_down: "event_item_right_resize_mouse_down";
    readonly event_item_add: "event_item_add";
    readonly event_item_delete: "event_item_delete";
    readonly row_click: "row_click";
    readonly row_delete: "row_delete";
};
export type EventBusEventNameType = typeof EventBusEventName[keyof typeof EventBusEventName];
