package com.shopsphere.service;

import com.shopsphere.dto.DashboardResponse;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardService(UserRepository userRepository,
                            ProductRepository productRepository,
                            OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardResponse getDashboard() {

        long totalUsers = userRepository.count();

        long totalProducts = productRepository.count();

        long totalOrders = orderRepository.count();

        long pendingOrders =
                orderRepository.countByStatus(OrderStatus.PENDING);

        Double totalRevenue = orderRepository.getTotalRevenue();

        return new DashboardResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders
        );
    }
}