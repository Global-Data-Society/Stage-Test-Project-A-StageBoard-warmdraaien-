"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ErrorModal({ message }: { message: string }) {
  const [isOpen] = useState(true);
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
      onClose={() => {}}
      classNames={{
        backdrop: "bg-white/10 backdrop-blur-md",
      }}
    >
      <ModalContent className="self-center relative z-50 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl max-h-[40%] overflow-auto">
        <>
          <ModalHeader>
            <h2 className="text-xl font-bold text-red-500">Error</h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-200">{message}</p>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button
              variant="negative"
              onClick={() => router.push("/logout")}
            >
              Logout
            </Button>
            <Button
              variant="positive"
              onClick={() => location.reload()}
            >
              Refresh
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
