package com.oasis.oasis.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.oasis.oasis.user.User;



@Repository
public interface OasisUsersRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByEmailAddressAndPassword(String emailAddress, String password);

    Optional<User> findByEmailAddress(String emailAddress);
    
    boolean existsByEmailAddress(String emailAddress);
    
}
