package com.shopsphere.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class CouponRequest {

    @NotBlank
    private String code;

    @NotNull
    @Min(1)
    @Max(100)
    private Double discountPercentage;

    @NotNull
    @Positive
    private Double minimumOrderAmount;

    @NotNull
    private LocalDate expiryDate;

    @NotNull
    private Boolean active;

    public CouponRequest() {
    }

    public CouponRequest(String code,
                         Double discountPercentage,
                         Double minimumOrderAmount,
                         LocalDate expiryDate,
                         Boolean active) {

        this.code = code;
        this.discountPercentage = discountPercentage;
        this.minimumOrderAmount = minimumOrderAmount;
        this.expiryDate = expiryDate;
        this.active = active;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Double getMinimumOrderAmount() {
        return minimumOrderAmount;
    }

    public void setMinimumOrderAmount(Double minimumOrderAmount) {
        this.minimumOrderAmount = minimumOrderAmount;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}