package com.oasis.oasis.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class EmailAddressNotFoundException extends RuntimeException{

    public EmailAddressNotFoundException(String message){
        super(message);
    }
}
