import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

const DEFAULT_CHANNEL_ID = 'default';

// Android requires a channel before any notification can be displayed on
// it (8.0+) — iOS has no equivalent concept, createChannel is a no-op there.
// Created once, lazily, the first time it's actually needed rather than at
// module load — matches the "no Firebase/init work in dev unless needed"
// spirit of the CLAUDE.md Sentry/Analytics dev-guard rule.
let channelReady: Promise<string> | null = null;

export const ensureDefaultChannel = () => {
  if (!channelReady) {
    channelReady = notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
  }
  return channelReady;
};

export const displayLocalNotification = async (
  title: string,
  body: string,
) => {
  await ensureDefaultChannel();
  await notifee.displayNotification({
    title,
    body,
    android: { channelId: DEFAULT_CHANNEL_ID, pressAction: { id: 'default' } },
  });
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  delayMs: number,
) => {
  await ensureDefaultChannel();
  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId: DEFAULT_CHANNEL_ID,
        pressAction: { id: 'default' },
      },
    },
    { type: TriggerType.TIMESTAMP, timestamp: Date.now() + delayMs },
  );
};
