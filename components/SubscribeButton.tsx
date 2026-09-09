"use client";

import { useState } from "react";
import Modal from "./Modal";
import EmailCapture from "./EmailCapture";

export default function SubscribeButton({
  label = "Subscribe",
}: {
  label?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button type="button" className="mo-chip" onClick={() => setShow(true)}>
        {label}
      </button>
      {show && (
        <Modal
          title="Subscribe to the newsletter"
          subtitle="Deep tech research and insights. Always free."
          onClose={() => setShow(false)}
        >
          <div className="sub-modal">
            <EmailCapture variant="band" cta="Sign up — free" />
          </div>
        </Modal>
      )}
    </>
  );
}
