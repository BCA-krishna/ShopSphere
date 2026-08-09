package com.shopsphere.dto;

public class PaymentRequest {

    private String paymentMethod;

    public PaymentRequest() {
    }

    public PaymentRequest(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}