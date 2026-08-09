package com.shopsphere.service;

import com.shopsphere.dto.PaymentRequest;
import com.shopsphere.dto.PaymentResponse;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.Payment;
import com.shopsphere.exception.OrderNotFoundException;
import com.shopsphere.exception.PaymentNotFoundException;
import com.shopsphere.entity.PaymentStatus;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public PaymentResponse createPayment(Long orderId,
                                         PaymentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found"));

        paymentRepository.findByOrder(order)
                .ifPresent(payment -> {
                    throw new RuntimeException("Payment already exists for this order");
                });

        Payment payment = new Payment();
        payment.setOrder(order);

        payment.setAmount(order.getTotalAmount());

        payment.setPaymentMethod(request.getPaymentMethod());

        payment.setStatus(PaymentStatus.PENDING);

        payment.setPaymentDate(LocalDateTime.now());

        payment.setTransactionId(UUID.randomUUID().toString());

        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentResponse(
                savedPayment.getId(),
                savedPayment.getAmount(),
                savedPayment.getPaymentMethod(),
                savedPayment.getTransactionId(),
                savedPayment.getStatus(),
                savedPayment.getPaymentDate()
        );


    }

    public PaymentResponse getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new PaymentNotFoundException("Payment not found"));

        return new PaymentResponse(
                payment.getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getStatus(),
                payment.getPaymentDate()
        );
    }


    @Transactional
    public PaymentResponse paymentSuccess(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new PaymentNotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);

        payment.setTransactionId(UUID.randomUUID().toString());

        payment.setPaymentDate(LocalDateTime.now());

        Order order = payment.getOrder();

        order.setStatus(OrderStatus.CONFIRMED);

        orderRepository.save(order);

        Payment updatedPayment = paymentRepository.save(payment);

        return new PaymentResponse(
                updatedPayment.getId(),
                updatedPayment.getAmount(),
                updatedPayment.getPaymentMethod(),
                updatedPayment.getTransactionId(),
                updatedPayment.getStatus(),
                updatedPayment.getPaymentDate()
        );
    }

    @Transactional
    public PaymentResponse paymentFailed(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new PaymentNotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);

        payment.setPaymentDate(LocalDateTime.now());

        Order order = payment.getOrder();

        order.setStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);

        Payment updatedPayment = paymentRepository.save(payment);

        return new PaymentResponse(
                updatedPayment.getId(),
                updatedPayment.getAmount(),
                updatedPayment.getPaymentMethod(),
                updatedPayment.getTransactionId(),
                updatedPayment.getStatus(),
                updatedPayment.getPaymentDate()
        );
    }


}