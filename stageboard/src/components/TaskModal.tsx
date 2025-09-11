"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import Button from "@/components/Button";

type TaskModalFormProps = {
  onCreate: (title: string) => void;
};

export default function TaskModalForm({ onCreate }: TaskModalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle("");
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="positive" onClick={() => setIsOpen(true)}>
        + Add Task
      </Button>

      <Modal hideCloseButton isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md z-40"></div>

        <ModalContent className="self-center relative z-50 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl max-h-[40%] overflow-auto">
          <ModalHeader>
            <h2 className="text-xl font-bold text-blue-500">New Task</h2>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                className="p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button variant="negative" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="positive" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
