package com.shopsphere.exception;

public class WishlistAlreadyExistsException extends RuntimeException {

    public WishlistAlreadyExistsException(String message) {
        super(message);
    }
}