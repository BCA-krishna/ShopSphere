package com.shopsphere.dto;

import java.time.LocalDateTime;

public class WishlistResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Double price;
    private LocalDateTime addedDate;

    public WishlistResponse() {
    }

    public WishlistResponse(Long id, Long productId,
                            String productName,
                            Double price,
                            LocalDateTime addedDate) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.addedDate = addedDate;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Double getPrice() {
        return price;
    }

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setPrice(Double price) {
        this.price = price;
    }


    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }
}