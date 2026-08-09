package com.shopsphere.controller;

import com.shopsphere.dto.PaymentRequest;
import com.shopsphere.dto.PaymentResponse;
import com.shopsphere.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create/{orderId}")
    public PaymentResponse createPayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequest request) {

        return paymentService.createPayment(orderId, request);
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse getPaymentById(
            @PathVariable Long paymentId) {

        return paymentService.getPaymentById(paymentId);
    }

    @PutMapping("/success/{paymentId}")
    public PaymentResponse paymentSuccess(
            @PathVariable Long paymentId) {

        return paymentService.paymentSuccess(paymentId);
    }

    @PutMapping("/failed/{paymentId}")
    public PaymentResponse paymentFailed(
            @PathVariable Long paymentId) {

        return paymentService.paymentFailed(paymentId);
    }
}