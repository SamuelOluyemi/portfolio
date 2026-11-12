import { useMemo, useState } from "react";
import {
  deleteMessage,
  updateMessageStatus,
} from "../../services/messageService";
import type { ContactMessage, MessageStatus } from "../../types/messages";

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
  onMessagesChange: (messages: ContactMessage[]) => void;
}

function MessagesManager({
  initialMessages,
  onMessagesChange,
}: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const filteredMessages = useMemo(
    () =>
      filter === "all"
        ? messages
        : messages.filter((message) => message.status === filter),
    [messages, filter],
  );

  const updateMessages = (updated: ContactMessage[]) => {
    setMessages(updated);
    onMessagesChange(updated);
  };

  const handleStatusChange = async (
    message: ContactMessage,
    status: MessageStatus,
  ) => {
    setError("");
    setSavingId(message.id);

    try {
      const updated = await updateMessageStatus(message.id, status);

      const next = messages.map((item) =>
        item.id === updated.id ? updated : item,
      );

      updateMessages(next);

      if (selectedMessage?.id === updated.id) {
        setSelectedMessage(updated);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update message.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the message from ${message.name}?`,
    );

    if (!confirmed) return;

    setError("");
    setSavingId(message.id);

    try {
      await deleteMessage(message.id);

      updateMessages(messages.filter((item) => item.id !== message.id));

      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete message.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const statusClass = (status: MessageStatus) => {
    switch (status) {
      case "unread":
        return "bg-blue-950 text-blue-300";
      case "read":
        return "bg-green-950 text-green-300";
      case "archived":
        return "bg-slate-800 text-slate-400";
    }
  };

  const unreadCount = messages.filter(
    (message) => message.status === "unread",
  ).length;

  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="mt-1 text-slate-400">
          Review and manage contact form submissions.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total messages</p>
          <p className="mt-2 text-3xl font-bold">{messages.length}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Unread messages</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">{unreadCount}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Archived messages</p>
          <p className="mt-2 text-3xl font-bold">
            {messages.filter((item) => item.status === "archived").length}
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-lg bg-red-950 p-4 text-red-300">
          {error}
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "unread", "read", "archived"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {status}
            {status === "unread" && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          No {filter === "all" ? "" : filter} messages found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <article
              key={message.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{message.subject}</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {message.name} · {message.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(message.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(message.status)}`}
                >
                  {message.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm text-slate-400">
                {message.message.length > 180
                  ? `${message.message.slice(0, 180)}...`
                  : message.message}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === "unread") {
                      void handleStatusChange(message, "read");
                    }
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                >
                  View message
                </button>

                {message.status !== "unread" && (
                  <button
                    disabled={savingId === message.id}
                    onClick={() => void handleStatusChange(message, "unread")}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-50"
                  >
                    Mark unread
                  </button>
                )}

                {message.status !== "archived" && (
                  <button
                    disabled={savingId === message.id}
                    onClick={() => void handleStatusChange(message, "archived")}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-50"
                  >
                    Archive
                  </button>
                )}

                {message.status === "archived" && (
                  <button
                    disabled={savingId === message.id}
                    onClick={() => void handleStatusChange(message, "read")}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}

                <button
                  disabled={savingId === message.id}
                  onClick={() => void handleDelete(message)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p>
                <span className="text-slate-200">From:</span>{" "}
                {selectedMessage.name}
              </p>
              <p>
                <span className="text-slate-200">Email:</span>{" "}
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-400 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </p>
              <p>
                <span className="text-slate-200">Received:</span>{" "}
                {formatDate(selectedMessage.createdAt)}
              </p>
              <p>
                <span className="text-slate-200">Status:</span>{" "}
                <span className="capitalize">{selectedMessage.status}</span>
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-slate-800 p-5">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                {selectedMessage.message}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
              >
                Reply by email
              </a>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-semibold hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MessagesManager;
