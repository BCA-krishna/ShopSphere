package com.shopsphere.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {

        super(message);
    }
}
