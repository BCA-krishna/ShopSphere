package com.shopsphere.service;
import com.shopsphere.dto.ReviewRequest;
import com.shopsphere.dto.ReviewResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.*;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service

public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository,
                         OrderRepository orderRepository) {

        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    private ReviewResponse mapToResponse(Review review) {

        return new ReviewResponse(
                review.getId(),
                review.getUser().getFullName(),
                review.getProduct().getName(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate()
        );
    }

    private boolean hasPurchasedProduct(User user, Product product) {

        List<Order> orders = orderRepository.findByUser(user);

        for (Order order : orders) {

            if (order.getStatus() == OrderStatus.CONFIRMED) {

                for (OrderItem item : order.getItems()) {

                    if (item.getProduct().getId().equals(product.getId())) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public ReviewResponse addReview(ReviewRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        if (!hasPurchasedProduct(user, product)) {
            throw new ReviewNotAllowedException(
                    "You can review only purchased products");
        }

        reviewRepository.findByUserAndProduct(user, product)
                .ifPresent(review -> {
                    throw new ReviewAlreadyExistsException(
                            "You have already reviewed this product");
                });

        Review review = new Review();

        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        List<Review> reviews = reviewRepository.findByProduct(product);

        return reviews.stream()
                .map(this::mapToResponse)
                .toList();

    }

    public ReviewResponse updateReview(Long reviewId,
                                       ReviewRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ReviewNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to update this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);

        return mapToResponse(updatedReview);
    }

    public void deleteReview(Long reviewId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ReviewNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to delete this review");
        }

        reviewRepository.delete(review);
    }
}
