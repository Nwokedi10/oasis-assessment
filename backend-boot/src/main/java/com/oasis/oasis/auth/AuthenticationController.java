package com.oasis.oasis.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oasis.oasis.exception.InvalidCredentialsException;
import com.oasis.oasis.exception.RegistrationException;
import com.oasis.oasis.exception.ResourceNotFoundException;
import com.oasis.oasis.user.UserRepository;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;@Autowired
  private UserRepository userRepository;
    @Autowired
    private HttpSession httpSession; 

  @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody RegisterRequest request) {
        String sanitizedEmail = sanitizeInput(request.getEmailAddress());
        String sanitizedPassword = sanitizeInput(request.getPassword());

        if (!isValidEmail(sanitizedEmail)) {
            return ResponseEntity.badRequest().body("Invalid email address");
        }
        if (sanitizedPassword == null || sanitizedPassword.length() < 4) {
            return ResponseEntity.badRequest().body("Password must be at least 4 characters long");
        }

        if (userRepository.existsByEmailAddress(request.getEmailAddress())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email address is already registered");
        }

        try {
            AuthenticationResponse response = service.create(request);
            return ResponseEntity.ok(response);
        } catch (RegistrationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

  
    @PostMapping("/validate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        String sanitizedEmail = sanitizeInput(request.getEmailAddress());
        httpSession.removeAttribute("email");
    
        if (!isValidEmail(sanitizedEmail)) {
            return ResponseEntity.badRequest().body("Invalid email address");
        }
        if (!userRepository.existsByEmailAddress(request.getEmailAddress())) {
          return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email address or password");
      }
        try {
            AuthenticationResponse response = service.authenticate(request);
            httpSession.setAttribute("email", sanitizedEmail);

            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email address or password");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User does not exist");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }
    

    private boolean isValidEmail(String email) {
        return email != null && email.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    }
    private String sanitizeInput(String input) {
      // we can always use better libraries like OWASP Java Encoder
      return input != null ? input.replaceAll("[^a-zA-Z0-9@._-]", "") : null;
  }
  

  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }


}
