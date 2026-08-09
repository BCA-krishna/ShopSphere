package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ApplyCouponRequest {

    @NotBlank
    private String code;

    @NotNull
    @Positive
    private Double orderAmount;

    public ApplyCouponRequest() {
    }

    public ApplyCouponRequest(String code,
                              Double orderAmount) {
        this.code = code;
        this.orderAmount = orderAmount;
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
}