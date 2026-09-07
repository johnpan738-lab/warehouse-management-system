package gr.warehouse.config;

import gr.warehouse.model.User;
import gr.warehouse.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "User not found: " + username
                            )
                    );

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .roles("USER")
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Swagger / OpenAPI:
                         * απαιτεί username και password.
                         */
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).authenticated()

                        /*
                         * H2 Console:
                         * χρησιμοποιεί το δικό της authentication.
                         */
                        .requestMatchers(
                                "/h2-console/**"
                        ).permitAll()

                        /*
                         * REST API της εφαρμογής.
                         */
                        .requestMatchers(
                                "/users/**",
                                "/warehouses/**",
                                "/products/**",
                                "/receipts/**",
                                "/shipments/**",
                                "/inventory/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                /*
                 * HTTP Basic Authentication για Swagger.
                 */
                .httpBasic(Customizer.withDefaults())

                /*
                 * Απαραίτητο για το H2 Console.
                 */
                .headers(headers -> headers
                        .frameOptions(frame ->
                                frame.sameOrigin())
                );

        return http.build();
    }
}