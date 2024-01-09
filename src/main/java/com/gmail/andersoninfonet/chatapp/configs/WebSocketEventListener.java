package com.gmail.andersoninfonet.chatapp.configs;

import java.util.Objects;
import java.util.Optional;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.gmail.andersoninfonet.chatapp.requests.ChatMessage;
import com.gmail.andersoninfonet.chatapp.requests.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageSendingOperations;
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        if (Objects.nonNull(headerAccessor.getSessionAttributes())) {
            String username = (String) headerAccessor.getSessionAttributes().get("username");
            Optional.ofNullable(username)
                .ifPresent(user -> {
                    log.info("User disconnected: {} ", user);
                    messageSendingOperations.convertAndSend("/topic/public",new ChatMessage(null, user, MessageType.LEAVE));
                });
        }

    }
}
