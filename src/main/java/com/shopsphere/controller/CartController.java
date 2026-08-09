package com.shopsphere.controller;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.CartResponse;
import com.shopsphere.dto.UpdateCartItemRequest;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public String addToCart(@Valid @RequestBody AddToCartRequest request) {

        cartService.addToCart(request);
        return "Product added to cart successfully";
    }
    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }
    @PutMapping("/items/{cartItemId}")
    public String updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        cartService.updateCartItem(cartItemId, request);

        return "Cart updated successfully";
    }
    @DeleteMapping("/items/{cartItemId}")
    public String removeCartItem(@PathVariable Long cartItemId) {

        cartService.removeCartItem(cartItemId);

        return "Cart item removed successfully";
    }
}