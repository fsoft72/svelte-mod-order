// This file is autogenerated by liwe3-svelte
/* eslint-disable @typescript-eslint/no-explicit-any */

/*=== f2c_start __file ===*/
import type { User, UserSmall } from "$modules/user/types";

/*=== f2c_end __file ===*/

/** OrderStatus - Status of an order */
export enum OrderStatus {
	/** The order has been cancelled */
	cancelled = "cancelled",
	/** The order is completed */
	completed = "completed",
	/** We are working on your order */
	in_progress = "in_progress",
	/** The order is brand new */
	new = "new",
	/** The order is ready to be processed */
	ready = "ready",
	/** The order is ready to be delivered */
	to_deliver = "to_deliver",
	/** The transaction has started */
	transaction = "transaction",
};

/** OrderPaymentStatus - The status of order payment */
export enum OrderPaymentStatus {
	/** The payment has been aborted */
	aborted = "aborted",
	/** The order has been canceled */
	canceled = "canceled",
	/** The order is in the paying process */
	in_pay = "in_pay",
	/** The order is not paied yet */
	not_paid = "not_paid",
	/** The order has been paid */
	paid = "paid",
	/** The payment has been refunded */
	refunded = "refunded",
};

/** Order */
export interface Order {
	/** the main id field */
	id?: string;
	/** The domain name */
	domain?: string;
	/** Unique order code */
	code?: string;
	/** The user that created the owner */
	id_user?: string;
	/** Session ID (when the user is not logged in) */
	session?: string;
	/** The order status [ 'new', 'open', 'confirmed', 'completed', 'canceled', 'aborted'] */
	status?: OrderStatus;
	/** Total order amount (vat excl) */
	total_net?: number;
	/** Total order amount (vat incl) */
	total_vat?: number;
	/** The full price without discounts */
	original_total_vat?: number;
	/** Percentage of discount */
	discount?: number;
	/** Number of items in the order */
	num_items?: number;
	/** Flag T/F for the orders are valid */
	valid?: boolean;
	/** Payment mode */
	payment_mode?: string;
	/** The transaction ID */
	transaction_id?: string;
	/** The session ID for payment */
	session_id?: string;
	/**  */
	payment_status?: OrderPaymentStatus;
	/** When the order has been deleted */
	deleted?: Date;
	/** Small user details */
	user?: UserSmall;
	/** Order user notes */
	notes?: string;
	/** The delivery address */
	address?: any;
}

/** OrderItem */
export interface OrderItem {
	/** the main id field */
	id: string;
	/** The domain name */
	domain: string;
	/** Order ID */
	id_order?: string;
	/** Product unique code */
	prod_code?: string;
	/** Product name */
	name?: string;
	/** Quantity */
	quant?: number;
	/** Original price (vat excl) */
	orig_price_net?: number;
	/** Original price (vat inc) */
	orig_price_vat?: number;
	/** Price net */
	price_net?: number;
	/** Price vat */
	price_vat?: number;
	/** Total net */
	total_net?: number;
	/** Total vat */
	total_vat?: number;
	/** Original total net */
	orig_total_net?: number;
	/** Original total vat */
	orig_total_vat?: number;
	/** The applied VAT */
	vat?: number;
	/** Coupon name */
	coupon?: string;
	/** Product image */
	image?: string;
}

/** OrderFull */
export interface OrderFull {
	/** the main id field */
	id: string;
	/** Unique order code */
	code: string;
	/** The user id */
	id_user: string;
	/** The user that created the order */
	user: User;
	/** The order status [ 'new', 'open', 'confirmed', 'completed', 'canceled', 'aborted'] */
	status: OrderStatus;
	/** Total order amount (vat excl) */
	total_net: number;
	/** Total order amount (vat incl) */
	total_vat: number;
	/** Number of items */
	num_items: number;
	/** Number of items in the order */
	items: OrderItem[];
	/** Flag T/F for the orders are valid */
	valid: boolean;
	/** Payment mode */
	payment?: string;
	/** The full price of all elements */
	original_total_vat: number;
	/** Total order discount */
	discount: number;
	/** The payment mode used */
	payment_mode: string;
	/** The transaction id */
	transaction_id: string;
	/** Order payment status */
	payment_status: OrderPaymentStatus;
	/** Order Creation Date */
	created: Date;
	/** Order notes */
	notes: string;
	/** Delivery address */
	address: any;
}

/** OrderPaymentLog */
export interface OrderPaymentLog {
	/** the main id field */
	id: string;
	/** The order ID */
	id_order: string;
	/** The payment mode */
	payment_mode: string;
	/** The transaction id */
	transaction_id: string;
	/**  */
	session_id?: string;
	/** Event name */
	event_name?: string;
	/** Transaction data */
	data?: any;
}

