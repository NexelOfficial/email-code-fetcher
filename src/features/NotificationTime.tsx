import { Container } from "../components/Container";
import { useSetting } from "../settings";

export const NotificationTime = () => {
  const time = useSetting("notification-time");
  const values = [2.5, 5, 7.5, 10, 12.5, 15];

  return (
    <Container class="flex-col mt-2">
      <p class="flex gap-x-2 w-full">
        <span>Notification duration</span>
        <span class="text-gray-600 italic">({time.setting()}s)</span>
      </p>
      <div class="relative w-full">
        <input
          onChange={(e) => time.setSetting(e.target.value)}
          type="range"
          max={values[values.length - 1]}
          min={values[0]}
          step={values[1] - values[0]}
          value={time.setting() || "5"}
          class="w-full z-20 h-2 bg-gray-300 appearance-none rounded-lg cursor-pointer accent-blue-700"
        />
      </div>
    </Container>
  );
};
