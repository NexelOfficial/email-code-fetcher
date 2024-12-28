import { useSetting } from "../settings";

export const UpdateInterval = () => {
  const interval = useSetting("update-interval");
  const values = [5, 10, 15, 20, 25, 30];

  return (
    <div class="mt-2 border-2 border-gray-200 rounded bg-white py-2 px-4">
      <p class="flex gap-x-2">
        <span>Update interval</span>
        <span class="text-gray-600 italic">({interval.setting()}s)</span>
      </p>
      <div class="relative">
        <input
          onChange={(e) => interval.setSetting(e.target.value)}
          type="range"
          max={values[values.length - 1]}
          min={values[0]}
          step={values[0]}
          value={interval.setting()}
          class="w-full z-20 h-2 bg-gray-300 appearance-none rounded-lg cursor-pointer accent-blue-800"
        />
      </div>
    </div>
  );
};
