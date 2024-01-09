package com.gmail.andersoninfonet.chatapp.resources;

import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.gmail.andersoninfonet.chatapp.requests.ChatMessage;

@Controller
public class ChatResource {
    
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage senMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
        @Payload ChatMessage chatMessage,
        SimpMessageHeaderAccessor headerAccessor) {
            
        Optional.ofNullable(headerAccessor)
            .ifPresent(accessor -> 
                Optional.ofNullable(accessor.getSessionAttributes())
                .ifPresent(attributes -> attributes.put("username", chatMessage.sender())));
            
        return chatMessage;
    }
}
