package itc.fundraising.utils;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        Map<String, List<String>> errors = new HashMap<>();

        for (FieldError error: bindingResult.getFieldErrors()) {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.computeIfAbsent(fieldName, key -> new ArrayList<>()).add(errorMessage);
        }

        ErrorDTO errorDto = ErrorDTO.builder()
                .errors(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ErrorDTO errorDto = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto);
    }

    @ExceptionHandler(TypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(TypeMismatchException ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDTO);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDTO);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleInternalException(Exception ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDTO);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorDTO errorDto = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDto);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ErrorDTO errorDto = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();

        if (ex.getCause() instanceof ConstraintViolationException constraintViolationException) {
            if (constraintViolationException.getConstraintName().equals("uk_username")) {
                Map<String, String> errors = new HashMap<>();
                errors.putIfAbsent("username", "Username tersebut sudah digunakan");
                errorDto.setErrors(errors);
            }
            if (constraintViolationException.getConstraintName().equals("uk_email")) {
                Map<String, String> errors = new HashMap<>();
                errors.putIfAbsent("email", "Email tersebut sudah digunakan");
                errorDto.setErrors(errors);
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorDto);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorDTO errorDto = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDto);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials() {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors("Username atau password salah")
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDTO);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFound() {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors("Username atau password salah")
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDTO);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatus(ResponseStatusException ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getReason())
                .build();
        return ResponseEntity.status(ex.getStatusCode()).body(errorDTO);
    }

    @ExceptionHandler(ClassCastException.class)
    public ResponseEntity<Object> handleClassCast(ClassCastException ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDTO);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleIOException(RuntimeException ex) {
        ErrorDTO errorDTO = ErrorDTO.builder()
                .errors(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDTO);
    }

}
