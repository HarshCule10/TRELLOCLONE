"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Tag,
  User,
  Clock,
  CheckSquare,
  Archive,
  Trash2,
  Activity as ActivityIcon,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Popover from "@/components/ui/Popover";
import Button from "@/components/ui/Button";
import CardDescription from "./CardDescription";
import Checklist from "@/components/checklists/Checklist";
import LabelPicker from "@/components/labels/LabelPicker";
import MemberPicker from "@/components/members/MemberPicker";
import MemberAvatar from "@/components/members/MemberAvatar";
import CoverPicker from "./CoverPicker";
import DatePicker from "./DatePicker";
import { useBoardContext } from "@/context/BoardContext";
import { getCardById } from "@/lib/api";
import type { CardDetail } from "@/lib/types";

interface CardDetailModalProps {
  cardId: string | null;
  onClose: () => void;
}

export default function CardDetailModal({ cardId, onClose }: CardDetailModalProps) {
  const { board, editCard, removeCard, lists } = useBoardContext();
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cardId) {
      setCard(null); // Clear previous card data to avoid flicker
      loadCard();
    } else {
      setCard(null);
    }
  }, [cardId]);

  const loadCard = async () => {
    if (!cardId) return;
    setLoading(true);
    try {
      const data = await getCardById(cardId);
      setCard(data);
    } catch (err) {
      console.error("Failed to load card:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!cardId) return null;

  const listName = lists.find((l) => l.id === card?.list_id)?.title || "";

  const handleUpdateField = async (updates: Partial<CardDetail>) => {
    if (!card) return;
    try {
      // Optimistic upate pattern but wait for save
      await editCard(card.id, updates);
      await loadCard(); // reload full details
    } catch (err) {
      console.error("Failed to update card:", err);
    }
  };

  const handleDelete = async () => {
    if (!card) return;
    if (confirm("Are you sure you want to delete this card?")) {
      await removeCard(card.id, card.list_id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={!!cardId}
      onClose={onClose}
      className="max-w-3xl !bg-[var(--trello-modal-bg)] !p-0 overflow-hidden"
    >
      {loading && !card ? (
        <div className="p-8 text-center text-[var(--trello-text-subtle)]">
          Loading card details...
        </div>
      ) : card ? (
        <div className="flex flex-col max-h-[90vh]">
          {/* Cover */}
          {card.cover_color && (
            <div
              className="h-28 w-full"
              style={{ backgroundColor: card.cover_color }}
            />
          )}

          {/* Header */}
          <div className="flex items-start gap-4 p-6 pb-2">
            <CreditCard
              size={24}
              className="mt-1 text-[var(--trello-text)] shrink-0"
            />
            <div className="flex-1 mr-4">
              <input
                className="text-xl font-semibold text-[var(--trello-text)] bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[var(--trello-input-focus)] rounded px-1 w-full -ml-1 resize-none"
                value={card.title}
                onChange={(e) => setCard({ ...card, title: e.target.value })}
                onBlur={(e) => handleUpdateField({ title: e.target.value })}
              />
              <p className="text-sm text-[var(--trello-text-subtle)] mt-1 px-1">
                in list <span className="underline">{listName}</span>
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Column */}
              <div className="flex-1 min-w-0">
                {/* Labels & Members row */}
                <div className="flex flex-wrap gap-6 mb-6 ml-10">
                  {card.members && card.members.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--trello-text-subtle)] mb-1">
                        Members
                      </h4>
                      <div className="flex gap-1 flex-wrap">
                        {card.members.map((m) => (
                          <MemberAvatar
                            key={m.id}
                            name={m.name}
                            avatarColor={m.avatar_color}
                            avatarUrl={m.avatar_url}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {card.labels && card.labels.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--trello-text-subtle)] mb-1">
                        Labels
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {card.labels.map((l) => (
                          <span
                            key={l.id}
                            className="px-3 py-1 text-sm font-semibold text-white rounded-[3px]"
                            style={{ backgroundColor: l.color }}
                          >
                            {l.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <CardDescription
                  description={card.description}
                  onSave={(desc) => handleUpdateField({ description: desc })}
                />

                {/* Checklists */}
                {card.checklists?.map((checklist) => (
                  <Checklist
                    key={checklist.id}
                    checklist={checklist}
                    onUpdateTitle={() => {
                        // handled by checklist directly calling API in a full impl
                        loadCard();
                    }}
                    onDelete={() => {
                        loadCard();
                    }}
                    onAddItem={() => {
                        loadCard();
                    }}
                    onUpdateItem={() => {
                        loadCard();
                    }}
                    onDeleteItem={() => {
                        loadCard();
                    }}
                  />
                ))}

                {/* Activity Log */}
                <div className="flex items-center gap-4 mb-4 mt-8 text-[var(--trello-text)]">
                  <ActivityIcon size={24} className="shrink-0" />
                  <h3 className="text-lg font-semibold">Activity</h3>
                </div>
                <div className="ml-10 space-y-4">
                  {card.activities?.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <MemberAvatar
                        name={activity.member_name}
                        avatarColor={activity.avatar_color}
                        avatarUrl={activity.avatar_url}
                        size="md"
                      />
                      <div className="flex-1 text-sm">
                        <span className="font-semibold text-[var(--trello-text)]">
                          {activity.member_name}
                        </span>{" "}
                        <span className="text-[var(--trello-text)]">
                          {activity.description.replace(
                            `${activity.member_name} `,
                            ""
                          )}
                        </span>
                        <div className="text-xs text-[var(--trello-text-subtle)] mt-0.5">
                          {new Date(activity.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {card.activities?.length === 0 && (
                    <p className="text-sm text-[var(--trello-text-subtle)]">
                      No activity yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="w-full md:w-44 shrink-0 flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-[var(--trello-text-subtle)] mb-1">
                  Add to card
                </h4>

                <Popover
                  align="right"
                  title="Members"
                  trigger={
                    <Button variant="subtle" block className="justify-start">
                      <User size={16} /> Members
                    </Button>
                  }
                >
                  <MemberPicker
                    boardMembers={board?.members || []}
                    cardMembers={card.members || []}
                    onToggleMember={async (mId) => {
                        // TODO complete API integration for member toggle
                        loadCard();
                    }}
                  />
                </Popover>

                <Popover
                  align="right"
                  title="Labels"
                  trigger={
                    <Button variant="subtle" block className="justify-start">
                      <Tag size={16} /> Labels
                    </Button>
                  }
                >
                  <LabelPicker
                    boardLabels={board?.labels || []}
                    cardLabels={card.labels || []}
                    onToggleLabel={async (lId) => {
                         // TODO complete API integration for label toggle
                         loadCard();
                    }}
                  />
                </Popover>

                <Popover
                  align="right"
                  title="Cover"
                  trigger={
                    <Button variant="subtle" block className="justify-start mb-2">
                      <CreditCard size={16} /> Cover
                    </Button>
                  }
                >
                  <CoverPicker
                    currentColor={card.cover_color}
                    onSelectColor={(color) => handleUpdateField({ cover_color: color })}
                  />
                </Popover>

                <Popover
                  align="right"
                  title="Dates"
                  trigger={
                    <Button variant="subtle" block className="justify-start">
                      <Clock size={16} /> Dates
                    </Button>
                  }
                >
                  <DatePicker
                    currentDate={card.due_date}
                    onSave={(date) => handleUpdateField({ due_date: date })}
                  />
                </Popover>

                <h4 className="text-xs font-semibold text-[var(--trello-text-subtle)] mt-4 mb-1">
                  Actions
                </h4>

                <Button
                  variant="subtle"
                  block
                  className="justify-start"
                  onClick={() =>
                    handleUpdateField({ is_archived: !card.is_archived })
                  }
                >
                  <Archive size={16} />{" "}
                  {card.is_archived ? "Unarchive" : "Archive"}
                </Button>

                <Button
                  variant="danger"
                  block
                  className="justify-start mt-2"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
