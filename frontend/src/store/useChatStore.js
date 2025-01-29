import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./StoreAuth";

export const useChatStore = create((set, get) => ({
  message: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/users");
      set({ users: data });
    } catch (err) {
      toast.error("Failed to fetch users");
    }
    set({ isUserLoading: false });
  },

  getMessages: async (id) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${id}`);
      console.log("res", res);
      set({ message: res.data });
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessaage: async (messageData) => {
    const { selectedUser, message } = get();
     console.log("selected user",selectedUser);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`, // Use selectedUser directly
        messageData
      );
      set({ message: [...message, res.data] }); // Update state with new message
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },


  subscribeToNewMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.error("No user selected to subscribe to messages");
      return;
    }
    const socket = useAuth.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      
      set({
        message: [...get().message, newMessage],
      });
     
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },


  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
