import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";
import {
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const SIGNUP_WINDOW_MS = 60 * 60 * 1000;
const MAX_SIGNUPS_PER_WINDOW = 4;
const signupWindows = new Map<string, { count: number; resetsAt: number }>();

type ProviderResult = {
  status: "subscribed" | "queued";
  provider: string;
  providerId?: string;
  message: string;
};

async function deliverToProvider(email: string): Promise<ProviderResult> {
  const providerUrl = process.env.NEWSLETTER_PROVIDER_URL;
  const providerToken = process.env.NEWSLETTER_PROVIDER_TOKEN;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  if (providerUrl) {
    const response = await fetch(providerUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(providerToken ? { authorization: `Bearer ${providerToken}` } : {}),
      },
      body: JSON.stringify({ email, source: "global-ai-news" }),
    });
    if (!response.ok) {
      throw new Error(`Newsletter provider returned ${response.status}`);
    }
    const payload = (await response.json().catch(() => ({}))) as { id?: string };
    return {
      status: "subscribed",
      provider: "newsletter-webhook",
      providerId: payload.id,
      message: "You’re on the list. Your next Daily Brief is on its way.",
    };
  }

  if (resendApiKey && resendAudienceId) {
    const response = await fetch(
      `https://api.resend.com/audiences/${encodeURIComponent(resendAudienceId)}/contacts`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendApiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );
    if (!response.ok) {
      throw new Error(`Resend returned ${response.status}`);
    }
    const payload = (await response.json()) as { id?: string };
    return {
      status: "subscribed",
      provider: "resend",
      providerId: payload.id,
      message: "You’re on the list. Your next Daily Brief is on its way.",
    };
  }

  return {
    status: "queued",
    provider: "database-queue",
    message:
      "You’re on the list. Your subscription is queued for the next delivery run.",
  };
}

router.post("/newsletter/subscriptions", async (req, res): Promise<void> => {
  const now = Date.now();
  const clientKey = req.ip || req.socket.remoteAddress || "unknown";
  for (const [key, window] of signupWindows) {
    if (window.resetsAt <= now) signupWindows.delete(key);
  }
  const window = signupWindows.get(clientKey);
  if (window && window.count >= MAX_SIGNUPS_PER_WINDOW && window.resetsAt > now) {
    res.setHeader("Retry-After", String(Math.ceil((window.resetsAt - now) / 1000)));
    res.status(429).json({ error: "Please try again later." });
    return;
  }
  signupWindows.set(clientKey, window && window.resetsAt > now
    ? { count: window.count + 1, resetsAt: window.resetsAt }
    : { count: 1, resetsAt: now + SIGNUP_WINDOW_MS });

  if (typeof req.body?.website === "string" && req.body.website.trim().length > 0) {
    res.status(202).json(SubscribeNewsletterResponse.parse({
      status: "queued",
      provider: "database-queue",
      message: "You’re on the list. Your subscription is queued for the next delivery run.",
    }));
    return;
  }
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  try {
    const [existing] = await db
      .select()
      .from(newsletterSubscribersTable)
      .where(eq(newsletterSubscribersTable.email, email))
      .limit(1);

    const subscriber =
      existing ??
      (
        await db
          .insert(newsletterSubscribersTable)
          .values({ email, status: "queued", provider: "database-queue" })
          .returning()
      )[0];

    if (!subscriber) {
      res.status(500).json({ error: "Subscription could not be saved." });
      return;
    }

    const delivery = await deliverToProvider(email);
    await db
      .update(newsletterSubscribersTable)
      .set({
        status: delivery.status,
        provider: delivery.provider,
        providerId: delivery.providerId ?? null,
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribersTable.id, subscriber.id));

    res.json(
      SubscribeNewsletterResponse.parse({
        status: delivery.status,
        provider: delivery.provider,
        message: delivery.message,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Newsletter subscription failed");
    res.status(500).json({ error: "Subscription could not be saved." });
  }
});

export default router;