import React, { useCallback } from "react";

interface CodeInputFieldProps {
  index: number;
  field: { value: string };
  inputName: string;
  handleInputKeyDown: ({
    index,
    event,
  }: {
    index: number;
    event: React.KeyboardEvent<HTMLInputElement>;
  }) => void;
  handleInputChange: ({
    index,
    event,
  }: {
    index: number;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => void;
  inputsRef: React.MutableRefObject<HTMLInputElement[]>;
}

const CodeInputField: React.FC<CodeInputFieldProps> = ({
  index,
  field,
  inputName,
  handleInputKeyDown,
  handleInputChange,
  inputsRef,
}) => {
  const handleOnKeyDownAction = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleInputKeyDown({ index, event });
    },
    [handleInputKeyDown, index],
  );

  const handleInputChangeAction = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange({ index, event });
    },
    [handleInputChange, index],
  );

  const handleInputRef = useCallback(
    (input: HTMLInputElement) => {
      inputsRef.current[index] = input;
    },
    [index, inputsRef],
  );

  const value = field?.value?.[index] || "";

  return (
    <input
      key={index}
      type="text"
      maxLength={1}
      placeholder="-"
      value={value}
      name={inputName}
      ref={handleInputRef}
      onKeyDown={handleOnKeyDownAction}
      onChange={handleInputChangeAction}
    />
  );
};

export default CodeInputField;
