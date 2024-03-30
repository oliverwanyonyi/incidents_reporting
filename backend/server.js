const express = require("express");
const authRoutes = require("./routes/authRoutes");
const wardRoutes = require("./routes/wardRoutes");
const roleRoutes = require("./routes/roleRoutes");
const incidentsRoute = require("./routes/incidentsRoute");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const analyticsRoute = require("./routes/analyticsRoute");


const socket = require("socket.io");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const errorHandler = require("./middlewares/error");
const app = express();


const server = http.createServer(app);
let users_online = [];
const agents_online = new Map();
const ward_authorities = new Map();
const io = socket(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  req.users_online = users_online;
  req.agents_online = agents_online;
  req.ward_authorities = ward_authorities

  

  next();
});

app.use(cookieParser());
require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/counties", wardRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/incidents", incidentsRoute);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/analytics", analyticsRoute);


app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  db.sequelize
    .sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err);
    });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("user_join", (data) => {
    const userExists = users_online.findIndex(
      (user) => user.socket_id === socket.id
    );
    if (userExists === -1) {
      let user = { ...data, socket_id: socket.id };
      users_online.push(user);
      io.emit('users_online',users_online)
  io.emit("agents_online", Array.from(agents_online.values()));

    }
  });



  socket.on("agent_join", (data) => {
    let user = { ...data, socket_id: socket.id, busy: false };
   
    if (!agents_online.has(data.id)) {

      agents_online.set(data.id, user);

    }
    
  io.emit("agents_online", Array.from(agents_online.values()));
  io.emit('users_online',users_online)

  });

  socket.on('subadmin_join', (data)=>{
    let user = { ...data, socket_id: socket.id, busy: false };
   
    
    if(!ward_authorities.has(data.id)){
      ward_authorities.set(data.id, user)
    }
  })

  socket.on("end_chat", async (data) => {
    if (data.chatId) {
      await db.Chat.update(
        { ended: true }, // Set ended to true
        {
          where: { id: data.chatId }, // Condition to match the chat with the specified ID
        }
      );
    }
    if (data.isAgent) {
      const reporter_socket = users_online.find(
        (user) => user.id === data?.reporter
      ).socket_id;
      const agent = agents_online.get(data.agent);
      agent.busy = false;

      io.to(reporter_socket).emit("chat_ended", data.chatId);

      socket.emit("chat_ended", data?.chatId);

      removeUser(reporter_socket);
    } else {
      socket.emit("chat_ended", data?.chatId);
      const agent = agents_online.get(data.agent);
      agent.busy = false;
      const agent_socket = agent.socket_id;
      io.to(agent_socket).emit("chat_ended", data.chatId);

      removeUser(socket.id);
    }
  });

  // Handle events here

  socket.on("disconnect", () => {
    removeAgent(socket.id);
    removeUser(socket.id);
    removeWardAdmin(socket.id)
  });

  socket.on("message", async (data) => {
  
    let receiver, sender_socket, receiver_socket;
    if (data.isAgent) {
      receiver = users_online.find((user) => user.id === data.receiver_id);

      sender_socket = data?.sender_socket;
      receiver_socket = receiver?.socket_id;
      console.log(receiver, receiver_socket);
    } else {
      receiver = agents_online.get(data.receiver_id);
      sender_socket = data.sender_socket;
      receiver_socket = receiver?.socket_id;
    }
    let chat;

    if (!data.chatId) {
      chat = await db.Chat.create({ ended: false });

      await Promise.all(
        [data.receiver_id, data.sender_id].map(async (userId) => {
          await db.ChatUser.create({
            chat_id: chat.id,
            user: userId,
          });
        })
      );

      chat = await db.Chat.findOne({
        where: { id: chat.id },
        include: [
          {
            model: db.ChatUser,
          },
          {
            model: db.Message,
            include: [
              { model: db.User, as: "senderInfo" },
              { model: db.User, as: "receiverInfo" },
            ],
          },
        ],
      });

      const chatUsers = await db.ChatUser.findAll({
        where: {
          chat_id: chat.id,
        },
        include: [{ model: db.User, as: "chatUser" }],
      });
      let chat_users = chatUsers.map((chatUser) => chatUser.toJSON());

      chat = { ...chat.dataValues, chat_users };
      io.to(sender_socket).emit("new_chat", chat);
      io.to(receiver_socket).emit("new_chat", chat);
    }

    const message = await db.Message.create({
      chat_id: data.chatId ? data.chatId : chat.id,
      message: data?.message,
      receiver: data?.receiver_id,
      sender: data?.sender_id,
    });

    io.to(receiver_socket).emit("message_receive", {
      chatId: data.chatId ? data.chatId : chat.id,
      message: data.message,
      createdAt: message.createdAt,
      senderInfo: { full_name: data.sender, id: data.sender_id },
      receiver: { full_name: data?.reciver },
    });
  });

  function assignUserToAgent() {
    if (agents_online.size === 0 || users_online.length === 0) {
      let position =
        users_online.findIndex((user) => user.socket_id === socket.id) + 1;

      let maxWaitingTime = (position - 1) * 5;

      socket.emit("agent_busy", { maxWaitingTime, position });

      return;
    }

    const availableAgents = [...agents_online.values()].filter(
      (agent) => !agent.busy
    );
    if (availableAgents.length === 0) {
      let position =
        users_online.findIndex((user) => user.socket_id === socket.id) + 1;

      let maxWaitingTime = (position - 1) * 5;

      socket.emit("agent_busy", { maxWaitingTime, position });
      return;
    }

    const agent =
      availableAgents[Math.floor(Math.random() * availableAgents.length)];

    const next_user = users_online[0];

    io.to(agent.socket_id).emit("user_assigned", next_user);

    const userSocketId = next_user.socket_id;
    if (userSocketId) {
      console.log("should work since loopiter " + userSocketId);
      socket.emit("agent_assigned", agent);
    }
    agent.busy = true;
  }

  function removeAgent(socketId) {
    const agentId = getAgentIdBySocketId(socketId);
    console.log(agentId);
    if (agentId) {
      agents_online.delete(agentId);

      console.log(`Agent disconnected: ${socketId}`);

      io.emit("agents_online", Array.from(agents_online.values()));
    }
  }

  function removeWardAdmin(socketId) {
    const adminId = getAdminIdBySocketId(socketId);
  
    if (adminId) {
     ward_authorities.delete(adminId);

      console.log(`Admin disconnected: ${socketId}`);

    }
  }

  function removeUser(socketId) {
    const index = users_online.findIndex((user) => user.socket_id === socketId);

    if (index !== -1) {
      const removedUser = users_online.splice(index, 1)[0];
      console.log(`User disconnected: ${removedUser.id}`);
    }

    io.emit('users_online',users_online)

  }

  function getAgentIdBySocketId(socketId) {
    for (const [id, agent] of agents_online.entries()) {
      if (agent.socket_id === socketId) {
        return id;
      }
    }
    return null;
  }

  function getAdminIdBySocketId(socketId) {
    for (const [id, admin] of ward_authorities.entries()) {
      if (admin.socket_id === socketId) {
        return id;
      }
    }
    return null;
  }

  socket.on("agent_mark_as_available", () => {
    const agentId = getAgentIdBySocketId(socket.id);
    if (agentId) {
      agents_online.get(agentId).busy = false;
      console.log(`Agent marked as available: ${agentId}`);
      clearTimeout(timeout);
      assignUserToAgent();
    }
  });
});
