// src/utils/api/payment.api.ts
import { postData, fetchData } from "./api";

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
  };
  key_id: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  payment: {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    description: string;
    created_at: number;
  };
}

// Payment API object
export const paymentAPI = {
  // Create Razorpay Order
  createOrder: async (
    data: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    try {
      // Convert to Record<string, unknown> to fix type issue
      const requestData: Record<string, unknown> = {
        amount: data.amount,
        currency: data.currency || "INR",
        receipt: data.receipt || `order_${Date.now()}`,
      };

      const response = await postData<CreateOrderResponse>(
        "/payment/create-razorpay-order",
        requestData,
      );
      return response;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  },

  // Verify Payment
  verifyPayment: async (
    data: VerifyPaymentRequest,
  ): Promise<VerifyPaymentResponse> => {
    try {
      // Convert to Record<string, unknown> to fix type issue
      const requestData: Record<string, unknown> = {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      };

      const response = await postData<VerifyPaymentResponse>(
        "/payment/verify-payment",
        requestData,
      );
      return response;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Get Payment Status
  getPaymentStatus: async (
    paymentId: string,
  ): Promise<PaymentStatusResponse> => {
    try {
      const response = await fetchData<PaymentStatusResponse>(
        `/payment/payment-status/${paymentId}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw error;
    }
  },
};

export default paymentAPI;
