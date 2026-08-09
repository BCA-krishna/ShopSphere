package com.shopsphere.service;

import com.shopsphere.dto.*;
import com.shopsphere.entity.Coupon;
import com.shopsphere.exception.CouponNotFoundException;
import com.shopsphere.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    // ===========================
    // Create Coupon
    // ===========================

    public CouponResponse createCoupon(CouponRequest request) {

        Coupon coupon = new Coupon();

        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setActive(request.getActive());

        Coupon savedCoupon = couponRepository.save(coupon);

        return mapToResponse(savedCoupon);
    }

    // ===========================
    // Get All Coupons
    // ===========================

    public List<CouponResponse> getAllCoupons() {

        return couponRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===========================
    // Update Coupon
    // ===========================

    public CouponResponse updateCoupon(Long id,
                                       CouponRequest request) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() ->
                        new CouponNotFoundException("Coupon not found"));

        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setActive(request.getActive());

        Coupon updatedCoupon =
                couponRepository.save(coupon);

        return mapToResponse(updatedCoupon);
    }

    // ===========================
    // Delete Coupon
    // ===========================

    public void deleteCoupon(Long id) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() ->
                        new CouponNotFoundException("Coupon not found"));

        couponRepository.delete(coupon);
    }

    // ===========================
    // Apply Coupon
    // ===========================

    public ApplyCouponResponse applyCoupon(
            ApplyCouponRequest request) {

        Coupon coupon = couponRepository
                .findByCode(request.getCode().toUpperCase())
                .orElseThrow(() ->
                        new CouponNotFoundException("Invalid Coupon"));

        if (!coupon.getActive()) {

            throw new IllegalArgumentException(
                    "Coupon is inactive");
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Coupon has expired");
        }

        if (request.getOrderAmount()
                < coupon.getMinimumOrderAmount()) {

            throw new IllegalArgumentException(
                    "Minimum order amount is ₹"
                            + coupon.getMinimumOrderAmount());
        }

        double discount =
                request.getOrderAmount()
                        * coupon.getDiscountPercentage() / 100;

        double finalAmount =
                request.getOrderAmount() - discount;

        return new ApplyCouponResponse(

                coupon.getCode(),

                request.getOrderAmount(),

                discount,

                finalAmount,

                "Coupon Applied Successfully"
        );
    }

    // ===========================
    // Common Mapper
    // ===========================

    private CouponResponse mapToResponse(Coupon coupon) {

        return new CouponResponse(

                coupon.getId(),

                coupon.getCode(),

                coupon.getDiscountPercentage(),

                coupon.getMinimumOrderAmount(),

                coupon.getExpiryDate(),

                coupon.getActive()

        );
    }

}