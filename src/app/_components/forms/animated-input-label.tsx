import { sharedStyles } from "~/app/utils/shared-styles";

type AnimatedInputLabelProps = {
  id: string;
  type?: string;
  inputValue: string;
  fieldName?: string;
  labelText: string;
  guestIndex?: number;
  handleOnChange: ({
    field,
    inputValue,
    guestIndex,
  }: {
    field: string;
    inputValue: string;
    guestIndex: number;
  }) => void;
};

export default function AnimatedInputLabel({
  id,
  type,
  inputValue,
  fieldName,
  labelText,
  guestIndex,
  handleOnChange,
}: AnimatedInputLabelProps) {
  return (
    <div className="relative">
      <input
        type={type ?? "text"}
        id={id}
        placeholder=" "
        value={inputValue ?? ""}
        required
        onChange={(e) =>
          handleOnChange({
            field: fieldName ?? "",
            inputValue: e.target.value,
            guestIndex: guestIndex ?? 0,
          })
        }
        className={sharedStyles.animatedInput}
      />
      <label htmlFor={id} className={sharedStyles.animatedLabel}>
        {labelText}
      </label>
    </div>
  );
}
