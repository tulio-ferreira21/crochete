import { useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "../assets/types";
import Button from "./Button";
import { BiDownload } from "react-icons/bi";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent>();
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(outcome);

    setDeferredPrompt(undefined);
  };
  const isInstalled =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
  return (
    !isInstalled && (
      <Button variant="secondary" onClick={installApp}>
        <div className="flex gap-3 items-center">
          <BiDownload />
          <span className="hidden sm:block">Instalar</span>
        </div>
      </Button>
    )
  );
}
