package gr.warehouse;

import gr.warehouse.model.User;
import gr.warehouse.repository.UserRepository;
import gr.warehouse.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        userService = new UserService(
                userRepository,
                passwordEncoder
        );
    }

    @Test
    void userServiceShouldExist() {
        assertNotNull(userService);
    }

    @Test
    void createUserShouldEncodePasswordAndSaveUser() {

        User user = new User();
        user.setUsername("john");
        user.setPassword("1234");

        when(passwordEncoder.encode("1234"))
                .thenReturn("encodedPassword");

        when(userRepository.save(user))
                .thenReturn(user);

        User result = userService.createUser(user);

        assertNotNull(result);
        assertEquals("encodedPassword", result.getPassword());

        verify(passwordEncoder).encode("1234");
        verify(userRepository).save(user);
    }

    @Test
    void loginShouldReturnUserWithCorrectPassword() {

        User user = new User();
        user.setUsername("john");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "1234",
                "encodedPassword"))
                .thenReturn(true);

        Optional<User> result =
                userService.login("john", "1234");

        assertTrue(result.isPresent());
        assertEquals("john", result.get().getUsername());

        verify(userRepository).findByUsername("john");
        verify(passwordEncoder)
                .matches("1234", "encodedPassword");
    }

    @Test
    void loginShouldReturnEmptyWhenPasswordIsWrong() {

        User user = new User();
        user.setUsername("john");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrongPassword",
                "encodedPassword"))
                .thenReturn(false);

        Optional<User> result =
                userService.login("john", "wrongPassword");

        assertTrue(!result.isPresent());

        verify(userRepository).findByUsername("john");
        verify(passwordEncoder)
                .matches("wrongPassword", "encodedPassword");
    }

    @Test
    void loginShouldReturnEmptyWhenUserDoesNotExist() {

        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        Optional<User> result =
                userService.login("unknown", "1234");

        assertTrue(!result.isPresent());

        verify(userRepository).findByUsername("unknown");

        verifyNoInteractions(passwordEncoder);
    }
}