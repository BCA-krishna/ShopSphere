package com.shopsphere.controller;

import com.shopsphere.dto.ReviewRequest;
import com.shopsphere.dto.ReviewResponse;
import com.shopsphere.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ReviewResponse addReview(
            @Valid @RequestBody ReviewRequest request) {

        return reviewService.addReview(request);
    }

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getReviewsByProduct(
            @PathVariable Long productId) {

        return reviewService.getReviewsByProduct(productId);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request) {

        return reviewService.updateReview(reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    public String deleteReview(
            @PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);

        return "Review deleted successfully";
    }
}