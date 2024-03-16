package com.oasis.oasis.controller;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.oasis.oasis.exception.ResourceNotFoundException;
import com.oasis.oasis.repository.OasisUsersRepository;
import com.oasis.oasis.user.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import jakarta.servlet.http.HttpSession;



@RestController
@CrossOrigin
@RequestMapping("/api/v1/account")

public class OasisUsersController {

    @Autowired
    private OasisUsersRepository oasisUsersRepository;
    @Autowired
    private HttpSession httpSession; 
    
    @GetMapping("/user/{emailAddress}")
    public ResponseEntity<?> getUserByEmail(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String emailAddress) {
        try {
            String emailFromToken = getAuthenticatedUserEmail();

            if (emailFromToken != null && emailFromToken.equals(emailAddress)) {
                Optional<User> userOptional = oasisUsersRepository.findByEmailAddress(emailAddress);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    JsonObject responseJson = new JsonObject();
                    responseJson.addProperty("id", user.getId());
                    responseJson.addProperty("fullName", user.getFullName());
                    responseJson.addProperty("emailAddress", user.getEmailAddress());
                    return ResponseEntity.ok(responseJson.toString());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Request invalid");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request");
        }
    }

    
    @PutMapping("/updateUser/{emailAddress}")
    public ResponseEntity<?> updateUserData(@PathVariable String emailAddress, @RequestBody User userDetails) {
        User newUser = oasisUsersRepository.findByEmailAddress(emailAddress)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist"));
        String emailFromToken = getAuthenticatedUserEmail();
        if (emailFromToken != null && emailFromToken.equals(emailAddress)) {

            if (!userDetails.getEmailAddress().equals(emailAddress)) {
                if (oasisUsersRepository.existsByEmailAddress(userDetails.getEmailAddress())) {
                    return ResponseEntity.badRequest().body("Email address already exists");
                }
            }

            newUser.setFullName(userDetails.getFullName());
            try {
                User updatedUser = oasisUsersRepository.save(newUser);

                JsonObject responseJson = new JsonObject();
                responseJson.addProperty("id", updatedUser.getId());
                responseJson.addProperty("fullName", updatedUser.getFullName());
                responseJson.addProperty("emailAddress", updatedUser.getEmailAddress());
                return ResponseEntity.ok(responseJson.toString());

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Failed to update user details: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Request invalid");
        }
    }
    

    public String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername(); 
        }
        
        return null; 
    }
    
}
