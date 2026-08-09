package com.shopsphere.dto;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private String userName;
    private String productName;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;

    public ReviewResponse() {
    }

    public ReviewResponse(Long id,
                          String userName,
                          String productName,
                          Integer rating,
                          String comment,
                          LocalDateTime reviewDate) {

        this.id = id;
        this.userName = userName;
        this.productName = productName;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
    }

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }
}