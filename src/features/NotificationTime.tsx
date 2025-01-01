import { Container } from "../components/Container";
import { useSetting } from "../settings";

export const NotificationTime = () => {
  const time = useSetting("notification-time");

  return (
    <Container class="flex-col mt-2">
      <p class="flex gap-x-2 w-full">
        <span>Notification duration</span>
        <span class="text-gray-600 italic">({time.setting() || "5"}s)</span>
      </p>
      <div class="relative w-full">
        <input
          class="w-full z-20 h-2 bg-gray-300 appearance-none rounded-lg cursor-pointer accent-blue-700"
          onChange={(e) => time.setSetting(e.target.value)}
          value={time.setting() || "5"}
          type="range"
          max={15}
          min={2}
          step={1}
        />
      </div>
    </Container>
  );
};
