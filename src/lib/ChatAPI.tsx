export async function createNewChat(token: string) {
  const res = await fetch("http://localhost:8000/new-chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.chat_id;
}

export async function loadChatList(userId: string) {
  const res = await fetch(`https://glint-backend-aap0.onrender.com/list-chats?user_id=${userId}`);
  const data = await res.json();
  return data.chat_ids;
}

export async function sendMessage({
  token,
  chatId,
  message,
  model,
  temperature,
}: {
  token: string;
  chatId: string;
  message: string;
  model: string;
  temperature: number;
}) {
  const res = await fetch("https://glint-backend-aap0.onrender.com/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId, message, model, temperature }),
  });
  const data = await res.json();
  return data;
}

export async function getChatHistory(token: string, chatId: string) {
  const res = await fetch(`https://glint-backend-aap0.onrender.com/chat-history?chat_id=${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
