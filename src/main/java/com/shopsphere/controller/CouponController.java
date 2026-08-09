package com.shopsphere.controller;

import com.shopsphere.dto.ApplyCouponRequest;
import com.shopsphere.dto.ApplyCouponResponse;
import com.shopsphere.dto.CouponRequest;
import com.shopsphere.dto.CouponResponse;
import com.shopsphere.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    // ===========================
    // Admin APIs
    // ===========================

    @PostMapping("/api/admin/coupons")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CouponResponse createCoupon(
            @Valid @RequestBody CouponRequest request) {

        return couponService.createCoupon(request);
    }

    @GetMapping("/api/admin/coupons")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<CouponResponse> getAllCoupons() {

        return couponService.getAllCoupons();
    }

    @PutMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CouponResponse updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request) {

        return couponService.updateCoupon(id, request);
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String deleteCoupon(@PathVariable Long id) {

        couponService.deleteCoupon(id);

        return "Coupon deleted successfully";
    }

    // ===========================
    // Customer API
    // ===========================

    @PostMapping("/api/coupons/apply")
    public ApplyCouponResponse applyCoupon(
            @Valid @RequestBody ApplyCouponRequest request) {

        return couponService.applyCoupon(request);
    }

}