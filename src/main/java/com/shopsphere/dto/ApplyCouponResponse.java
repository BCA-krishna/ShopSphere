package com.shopsphere.dto;

public class ApplyCouponResponse {

    private String code;
    private Double orderAmount;
    private Double discount;
    private Double finalAmount;
    private String message;

    public ApplyCouponResponse() {
    }

    public ApplyCouponResponse(String code,
                               Double orderAmount,
                               Double discount,
                               Double finalAmount,
                               String message) {

        this.code = code;
        this.orderAmount = orderAmount;
        this.discount = discount;
        this.finalAmount = finalAmount;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(Double orderAmount) {
        this.orderAmount = orderAmount;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(Double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}