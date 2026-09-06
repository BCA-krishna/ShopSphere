package com.shopsphere.controller;

import com.shopsphere.dto.WishlistResponse;
import com.shopsphere.service.WishlistService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{productId}")
    public WishlistResponse addToWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService.addToWishlist(productId);
    }

    @GetMapping
    public List<WishlistResponse> getMyWishlist() {
        return wishlistService.getMyWishlist();
    }

    @DeleteMapping("/{productId}")
    public String removeFromWishlist(
            @PathVariable Long productId
    ) {
        wishlistService.removeFromWishlist(productId);

        return "Product removed from wishlist";
    }

    @GetMapping("/check/{productId}")
    public boolean checkWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService
                .isProductWishlisted(productId);
    }
}