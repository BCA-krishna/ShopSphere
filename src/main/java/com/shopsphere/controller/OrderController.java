package com.shopsphere.controller;

import com.shopsphere.dto.OrderResponse;
import com.shopsphere.dto.PlaceOrderRequest;
import com.shopsphere.dto.UpdateOrderStatusRequest;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {

        System.out.println(request.getFullName());
        System.out.println(request.getPhone());
        System.out.println(request.getDeliveryAddress());
        System.out.println(request.getCity());
        System.out.println(request.getState());
        System.out.println(request.getPincode());

        return orderService.placeOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getMyOrders() {
        return orderService.getMyOrders();
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/{orderId}/cancel")
    public String cancelOrder(@PathVariable Long orderId) {

        orderService.cancelMyOrder(orderId);

        return "Order cancelled successfully";
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        orderService.updateOrderStatus(orderId, request);

        return "Order status updated successfully";
    }


    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }


    @GetMapping("/whoami")
    public String whoAmI(Authentication authentication) {

        return "User = " + authentication.getName()
                + "\nAuthorities = " + authentication.getAuthorities();
    }




}