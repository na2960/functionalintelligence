"use client";

import Modal from "./Modal";
import ContactForm from "./ContactForm";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Contact us"
      subtitle="Tell us what you're after — we'll reply by email."
      onClose={onClose}
      width={580}
    >
      <ContactForm />
    </Modal>
  );
}
