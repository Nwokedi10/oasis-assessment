package com.oasis.oasis.auth;

import com.oasis.oasis.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  private String fullName;
  private String emailAddress;
  private String password;
  private Role role;
}
