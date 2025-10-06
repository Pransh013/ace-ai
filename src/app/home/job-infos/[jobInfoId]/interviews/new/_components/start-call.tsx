"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneIcon } from "lucide-react";

import { env } from "@/env/client";
import { errorToast } from "@/lib/error-toast";
import { Button } from "@/components/ui/button";
import { JobInfoTable } from "@/drizzle/schema";
import {
  createInterview,
  updateInterview,
} from "@/features/interviews/actions";
import { condenseMessages } from "@/services/hume/lib/condense-messages";
import { CondensedMessages } from "@/services/hume/components/condensed-messages";
import { useRouter } from "next/navigation";

export function StartCall({
  accessToken,
  jobInfo,
  user,
}: {
  accessToken: string;
  jobInfo: Pick<
    typeof JobInfoTable.$inferSelect,
    "id" | "title" | "description" | "experienceLevel"
  >;
  user: {
    name: string;
    imageUrl: string;
  };
}) {
  const { connect, readyState, chatMetadata, callDurationTimestamp } =
    useVoice();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const durationRef = useRef(callDurationTimestamp);
  const router = useRouter();

  useEffect(() => {
    if (!chatMetadata?.chatId || !interviewId) return;
    updateInterview(interviewId, { humeChatId: chatMetadata.chatId });
  }, [chatMetadata?.chatId, interviewId]);

  useEffect(() => {
    if (!interviewId) return;

    const intervalId = setInterval(() => {
      if (!durationRef.current) return;
      updateInterview(interviewId, { duration: durationRef.current });
    }, 20000);

    return () => clearInterval(intervalId);
  }, [interviewId]);

  useEffect(() => {
    if (readyState !== VoiceReadyState.CLOSED) return;
    if (!interviewId) {
      return router.push(`/home/job-infos/${jobInfo.id}/interviews`);
    }

    if (durationRef.current) {
      updateInterview(interviewId, { duration: durationRef.current });
    }
    router.push(`/home/job-infos/${jobInfo.id}/interviews/${interviewId}`);
  }, [readyState, interviewId, router, jobInfo.id]);

  if (readyState === VoiceReadyState.IDLE) {
    return (
      <div className="flex justify-center items-center h-screen-header">
        <Button
          size="lg"
          onClick={async () => {
            const res = await createInterview({ jobInfoId: jobInfo.id });
            if (res.error) {
              return errorToast(res.message);
            }
            setInterviewId(res.id);

            connect({
              auth: { type: "accessToken", value: accessToken },
              configId: env.NEXT_PUBLIC_HUME_CONFIG_ID,
              sessionSettings: {
                type: "session_settings",
                variables: {
                  userName: user.name,
                  title: jobInfo.title || "Not specified",
                  experienceLevel: jobInfo.experienceLevel,
                  description: jobInfo.description,
                },
              },
            });
          }}
        >
          Start Interview
        </Button>
      </div>
    );
  }

  if (
    readyState === VoiceReadyState.CONNECTING ||
    readyState === VoiceReadyState.CLOSED
  ) {
    return (
      <div className="flex justify-center items-center h-screen-header">
        <Loader2Icon className="animate-spin size-24" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen-header flex flex-col-reverse">
      <div className="container py-6 flex flex-col gap-5 items-center justify-end">
        <Messages user={user} />
        <Controls />
      </div>
    </div>
  );
}

function Messages({ user }: { user: { name: string; imageUrl: string } }) {
  const { messages: chatMessages, fft } = useVoice();
  const messages = useMemo(() => {
    return condenseMessages(chatMessages);
  }, [chatMessages]);
  return (
    <CondensedMessages
      messages={messages}
      user={user}
      maxFft={Math.max(...fft)}
    />
  );
}

function Controls() {
  const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } =
    useVoice();

  return (
    <div className="flex gap-5 rounded border p-2 w-fit sticky bottom-6 bg-background items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => (isMuted ? unmute() : mute())}
      >
        {isMuted ? <MicOffIcon className="text-destructive" /> : <MicIcon />}
        <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>
      <div className="self-stretch">
        <FftVisualizer fft={micFft} />
      </div>
      <div className="text-sm text-muted-foreground tabular-nums">
        {callDurationTimestamp}
      </div>
      <Button variant="ghost" size="icon" onClick={disconnect}>
        <PhoneIcon className="text-destructive" />
        <span className="sr-only">End Call</span>
      </Button>
    </div>
  );
}

function FftVisualizer({ fft }: { fft: number[] }) {
  return (
    <div className="flex gap-1 items-center h-full">
      {fft.map((value, index) => {
        const percent = (value / 4) * 100;
        return (
          <div
            key={index}
            className="min-h-0.5 bg-primary/80 w-0.5 rounded"
            style={{ height: `${percent < 10 ? 0 : percent}%` }}
          />
        );
      })}
    </div>
  );
}
