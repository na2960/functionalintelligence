"use client";

import Modal from "./Modal";
import ContactForm from "./ContactForm";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Schedule a Call"
      subtitle="Pick a time and we'll confirm by email — or just send a note."
      onClose={onClose}
      width={580}
    >
      <ContactForm />
    </Modal>
  );
}
