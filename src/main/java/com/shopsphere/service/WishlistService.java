package com.shopsphere.service;

import com.shopsphere.dto.WishlistResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.entity.Wishlist;
import com.shopsphere.exception.ProductNotFoundException;
import com.shopsphere.exception.UserNotFoundException;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.repository.WishlistRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }

    public WishlistResponse addToWishlist(Long productId) {

        User user = getLoggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {

            Wishlist existingWishlist =
                    wishlistRepository
                            .findByUserAndProduct(user, product)
                            .orElseThrow();

            return toWishlistResponse(existingWishlist);
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlist.setAddedDate(LocalDateTime.now());

        Wishlist savedWishlist =
                wishlistRepository.save(wishlist);

        return toWishlistResponse(savedWishlist);
    }

    public List<WishlistResponse> getMyWishlist() {

        User user = getLoggedInUser();

        return wishlistRepository.findByUser(user)
                .stream()
                .map(this::toWishlistResponse)
                .toList();
    }

    public void removeFromWishlist(Long productId) {

        User user = getLoggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        Wishlist wishlist =
                wishlistRepository
                        .findByUserAndProduct(user, product)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product is not in wishlist"
                                ));

        wishlistRepository.delete(wishlist);
    }

    public boolean isProductWishlisted(Long productId) {

        User user = getLoggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        return wishlistRepository
                .existsByUserAndProduct(user, product);
    }

    private WishlistResponse toWishlistResponse(Wishlist wishlist) {

        Product product = wishlist.getProduct();

        return new WishlistResponse(
                wishlist.getId(),
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory(),
                wishlist.getAddedDate()
        );
    }
}