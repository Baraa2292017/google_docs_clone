const fs = require("fs");
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected at", new Date().getTime());
  socket.on("get-document", (documentId) => {
    var document = loadDocument(documentId);
    if (document == null) {
      writeToDocument(documentId, "");
      document = loadDocument(documentId);
    }
    socket.emit("load-document", document.content);
    // create a room of Id = documentId
    socket.join(documentId);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", (data) => {
      console.log("Saving document...");
      writeToDocument(documentId, data);
    });
  });
});

const loadDocument = (documentId) => {
  const filePath = `./documents/${documentId}`;
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(
    fs.readFileSync(filePath, "utf-8", (err, data) => {
      if (err) {
        console.log("Error occurred while loading document", err);
        throw err;
      } else {
        console.log("Document loaded!");
        return JSON.parse(data);
      }
    })
  );
};

const writeToDocument = (documentId, documentContent) => {
  const filePath = `documents/${documentId}`;
  const json = JSON.stringify({
    id: documentId,
    content: documentContent,
  });
  fs.writeFileSync(filePath, json, "utf-8", (err) => {
    if (err) {
      console.log("Error occurred while writing to document", err);
    } else {
      console.log("File written!");
    }
  });
};
