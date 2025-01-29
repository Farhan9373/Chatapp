import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import { useThemeStore } from "../store/useThemeStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeletons";
import { useAuth } from "../store/StoreAuth";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    message,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToNewMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuth();
  const messageEndRef = useRef(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToNewMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser,
    getMessages,
    subscribeToNewMessages,
    unsubscribeFromMessages,
  ]);

  // This will automatically scroll to the last message every time the message list changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [message]);

  if (isMessageLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
        {message.length > 0 ? (
          message.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.senderId === authUser?._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      msg.senderId === authUser?._id
                        ? useAuth.profilepic || "/ninja.gif"
                        : selectedUser?.profilepic || "/ninja.gif"
                    }
                    alt="avatar"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>

              {/* Render text message */}
              {msg.text && (
                <div className="chat-bubble">
                  <p>{msg.text}</p>
                </div>
              )}

              {/* Conditionally render image if msg.image exists */}
              {msg.image && (
                <div className="chat-bubble flex flex-col">
                  <img
                    src={msg.image}
                    alt="chat-img"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No messages yet. Say hello!
          </p>
        )}
        {/* This div is used for scrolling to the bottom */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
