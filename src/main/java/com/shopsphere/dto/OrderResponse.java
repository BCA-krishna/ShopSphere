package com.shopsphere.dto;

import com.shopsphere.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long orderId;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private OrderStatus status;

    private String fullName;
    private String phone;
    private String deliveryAddress;
    private String city;
    private String state;
    private String pincode;
    private String couponCode;

    private Double discount;

    private Double finalAmount;

    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(Long orderId,
                         Double totalAmount,
                         LocalDateTime orderDate,
                         OrderStatus status,
                         String fullName,
                         String phone,
                         String deliveryAddress,
                         String city,
                         String state,
                         String pincode,
                         String couponCode,
                         Double discount,
                         Double finalAmount,
                         List<OrderItemResponse> items) {

        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.status = status;

        this.fullName = fullName;
        this.phone = phone;
        this.deliveryAddress = deliveryAddress;
        this.city = city;
        this.state = state;
        this.pincode = pincode;

        this.items = items;
        this.couponCode=couponCode;
        this.discount=discount;
        this.finalAmount=finalAmount;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
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
}