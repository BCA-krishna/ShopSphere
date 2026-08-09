package com.shopsphere.service;

import com.shopsphere.dto.OrderItemResponse;
import com.shopsphere.dto.OrderResponse;
import com.shopsphere.dto.PlaceOrderRequest;
import com.shopsphere.dto.UpdateOrderStatusRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.*;
import com.shopsphere.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        CouponRepository couponRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository=productRepository;
        this.couponRepository= couponRepository;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new CartEmptyException("Cart is empty");
        }

        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setFullName(request.getFullName());
        order.setPhone(request.getPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPincode(request.getPincode());


        double totalAmount = 0;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new OutOfStockException(
                        product.getName() + " is out of stock");
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            totalAmount +=
                    cartItem.getProduct().getPrice()
                            * cartItem.getQuantity();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        double discount = 0;
        double finalAmount = totalAmount;

        if (request.getCouponCode() != null &&
                !request.getCouponCode().trim().isEmpty()) {

            String couponCode = request.getCouponCode()
                    .trim()
                    .toUpperCase();

            Coupon coupon = couponRepository
                    .findByCode(couponCode)
                    .orElseThrow(() ->
                            new RuntimeException("Invalid coupon code"));

            // Check active
            if (!Boolean.TRUE.equals(coupon.getActive())) {
                throw new RuntimeException("Coupon is not active");
            }

            // Check expiry
            if (coupon.getExpiryDate() != null &&
                    coupon.getExpiryDate().isBefore(LocalDate.now())) {

                throw new RuntimeException("Coupon has expired");
            }

            // Check minimum order amount
            if (coupon.getMinimumOrderAmount() != null &&
                    totalAmount < coupon.getMinimumOrderAmount()) {

                throw new RuntimeException(
                        "Minimum order amount for this coupon is ₹"
                                + coupon.getMinimumOrderAmount()
                );
            }

            // Calculate discount
            discount = totalAmount
                    * coupon.getDiscountPercentage()
                    / 100;

            // Safety: discount should never exceed order total
            discount = Math.min(discount, totalAmount);

            finalAmount = totalAmount - discount;

            order.setCouponCode(coupon.getCode());
        }

        order.setDiscount(discount);
        order.setFinalAmount(finalAmount);

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        List<OrderItemResponse> items = savedOrder.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                savedOrder.getOrderDate(),
                savedOrder.getStatus(),
                savedOrder.getFullName(),
                savedOrder.getPhone(),
                savedOrder.getDeliveryAddress(),
                savedOrder.getCity(),
                savedOrder.getState(),
                savedOrder.getPincode(),
                savedOrder.getCouponCode(),
                savedOrder.getDiscount(),
                savedOrder.getFinalAmount(),
                items
        );
    }

    public List<OrderResponse> getMyOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(order -> {

                    List<OrderItemResponse> items = order.getItems()
                            .stream()
                            .map(item -> new OrderItemResponse(
                                    item.getProduct().getName(),
                                    item.getQuantity(),
                                    item.getPrice()
                            ))
                            .toList();

                    return new OrderResponse(
                            order.getId(),
                            order.getTotalAmount(),
                            order.getOrderDate(),
                            order.getStatus(),
                            order.getFullName(),
                            order.getPhone(),
                            order.getDeliveryAddress(),
                            order.getCity(),
                            order.getState(),
                            order.getPincode(),
                            order.getCouponCode(),
                            order.getDiscount(),
                            order.getFinalAmount(),
                            items
                    );

                })
                .toList();
    }

    @Transactional
    public void cancelMyOrder(Long orderId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found"));

        // Customer can cancel only their own order
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to cancel this order");
        }

        // Already cancelled
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        // Only pending orders can be cancelled
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending orders can be cancelled");
        }

        // Restore product stock
        for (OrderItem item : order.getItems()) {

            Product product = item.getProduct();

            product.setStock(
                    product.getStock() + item.getQuantity()
            );

            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);
    }

    public OrderResponse getOrderById(Long orderId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to view this order");
        }

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getOrderDate(),
                order.getStatus(),
                order.getFullName(),
                order.getPhone(),
                order.getDeliveryAddress(),
                order.getCity(),
                order.getState(),
                order.getPincode(),
                order.getCouponCode(),
                order.getDiscount(),
                order.getFinalAmount(),
                items
        );
    }

    public void updateOrderStatus(Long orderId,
                                  UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found"));

        if (request.getStatus() == OrderStatus.CANCELLED
                && order.getStatus() != OrderStatus.CANCELLED) {

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                product.setStock(
                        product.getStock() + item.getQuantity());

                productRepository.save(product);
            }
        }

        order.setStatus(request.getStatus());

        orderRepository.save(order);
    }

    public List<OrderResponse> getAllOrders() {

        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .map(order -> {

                    List<OrderItemResponse> items = order.getItems()
                            .stream()
                            .map(item -> new OrderItemResponse(
                                    item.getProduct().getName(),
                                    item.getQuantity(),
                                    item.getPrice()
                            ))
                            .toList();

                    return new OrderResponse(
                            order.getId(),
                            order.getTotalAmount(),
                            order.getOrderDate(),
                            order.getStatus(),
                            order.getFullName(),
                            order.getPhone(),
                            order.getDeliveryAddress(),
                            order.getCity(),
                            order.getState(),
                            order.getPincode(),
                            order.getCouponCode(),
                            order.getDiscount(),
                            order.getFinalAmount(),
                            items
                    );

                })
                .toList();
    }
}