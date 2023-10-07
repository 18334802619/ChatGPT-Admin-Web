"use client";

import useSWR from "swr";
import styles from "@/styles/module/home.module.scss";
import Locale from "@/locales";
import DeleteIcon from "@/icons/delete.svg";
import { useStore } from "@/store";

import { ChatSession } from "shared";
import { useRouter } from "next/navigation";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: Date;
  selected: boolean;
}) {
  return (
    <div
      className={`${styles["chat-item"]} ${
        props.selected && styles["chat-item-selected"]
      }`}
      onClick={props.onClick}
    >
      <div className={styles["chat-item-title"]}>{props.title}</div>
      <div className={styles["chat-item-info"]}>
        <div className={styles["chat-item-count"]}>
          {Locale.ChatItem.ChatItemCount(props.count)}
        </div>
        <div className={styles["chat-item-date"]}>
          {props.time.toLocaleString()}
        </div>
      </div>
      <div className={styles["chat-item-delete"]} onClick={props.onDelete}>
        <DeleteIcon />
      </div>
    </div>
  );
}

export function ChatList() {
  const router = useRouter();

  const [fetcher, session, selectSession] = useStore((state) => [
    state.fetcher,
    state.currentChatSessionId,
    state.updateSessionId,
  ]);
  const { data: sessions } = useSWR<ChatSession[]>("/chat/sessions", (url) => {
    return fetcher(url)
      .then((res) => res.json())
      .then((res) =>
        res.map((session: ChatSession & { _count: { messages: number } }) => ({
          ...session,
          messagesCount: session._count.messages,
          _count: undefined,
        })),
      );
  });

  return (
    <div className={styles["chat-list"]}>
      {sessions &&
        sessions.map((item, i) => (
          <ChatItem
            key={i}
            title={item.topic ?? "新的对话"}
            time={item.updatedAt}
            count={item.messagesCount}
            selected={session === item.id}
            onClick={() => selectSession(item.id, router)}
            onDelete={() => {}}
          />
        ))}
    </div>
  );
}
