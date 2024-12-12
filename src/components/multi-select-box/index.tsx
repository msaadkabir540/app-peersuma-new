import _ from "lodash";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useState, useRef, memo } from "react";

import colorStyles from "./color-styles";

import formatOptionLabelList from "./format-option-label";

import { useOutsideClickHook } from "@/src/helper/helper";

import {
  OptionsInterface,
  SelectBoxInterface,
} from "@/src/app/interface/multi-select-interface/multi-select-box-interface";

import "./style.scss";
import style from "./box.module.scss";

const SelectBox: React.FC<SelectBoxInterface> = ({
  name,
  label,
  badge,
  control,
  isMulti,
  iconColor,
  handleChange,
  options = [],
  errorMessage,
  wrapperClass,
  showCount,
  defaultValue,
  showSelected,
  customeStyles,
  selectBoxClass,
  disabled = false,
  required = false,
  isClearable = true,
  isSearchable = true,
  mediaOption = false,
  placeholderCustomfont,
  placeholderCustomColor,
  placeholder = "None Selected",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useOutsideClickHook(wrapperRef, () => {
    setIsMenuOpen(false);
  });
  return (
    <>
      <div className={`${style.wraper} ${wrapperClass}`} ref={wrapperRef}>
        <label
          style={{
            color: errorMessage ? "#ff5050" : " #252733",
          }}
        >
          {label}
        </label>
        <div
          className={`${style.selectBox} ${selectBoxClass}`}
          style={{
            cursor: disabled ? "unset" : "",
          }}
        >
          {control && (
            <Controller
              name={name}
              control={control}
              render={({ field }) => {
                const tooltipText = _.isArray(field?.value)
                  ? field?.value.join(", ")
                  : _.isObject(field?.value)
                    ? // ? field?.value?.barStatus // TODO
                      field?.value
                    : field?.value;

                const CustomValueContainer = ({
                  children,
                  ...props
                }: {
                  children: any;
                  props: any;
                }) => {
                  const selectedCount = _.isArray(field?.value) ? field?.value.length : 0;

                  // Check if more than one option is selected
                  if (showCount && selectedCount > 1) {
                    // Return a custom display
                    return (
                      <div
                        className={`value-container ${selectedCount > 1 ? "" : "mb-[-21px]"} text-[#ed1c24] md:text-[18px] text-[14px] font-semibold`}
                      >
                        {selectedCount} Selected
                      </div>
                    );
                  } else {
                    return (
                      <div className={`value-container ${selectedCount > 1 ? "" : "mb-[-21px]"}`}>
                        {children}
                      </div>
                    );
                  }
                };
                return disabled ? (
                  <div className={style.displayValueOnly}>{field.value}</div>
                ) : (
                  <div>
                    <Select
                      isMulti={isMulti}
                      required={required}
                      menuIsOpen={isMenuOpen}
                      closeMenuOnScroll={true}
                      closeMenuOnSelect={!isMulti || !isMenuOpen}
                      onMenuOpen={() => setIsMenuOpen(true)}
                      onMenuClose={() => setIsMenuOpen(false)}
                      formatOptionLabel={(data, metaData) =>
                        formatOptionLabelList({
                          data: {
                            badge: badge || false,
                            data,
                            metaData,
                            mediaOption,
                          },
                        })
                      }
                      hideSelectedOptions={showSelected ? false : true}
                      options={options}
                      styles={colorStyles({
                        iconColor,
                        mediaOption,
                        customeStyles,
                        errorMessage: "",
                        clearOption: true,
                        placeholderCustomColor,
                        placeholderCustomfont,
                      })}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: "blue",
                          primary25: "pink",
                          primary: "black",
                        },
                      })}
                      className={`${style.selectClass}`}
                      {...field}
                      isDisabled={disabled}
                      value={defaultValue ?? setDefaultValueInSelectBox(field?.value, options)}
                      onChange={(selectedOption) => {
                        const value =
                          isMulti && _.isArray(selectedOption)
                            ? selectedOption?.map((e) => e.value)
                            : _.isObject(selectedOption) && "value" in selectedOption
                              ? selectedOption?.value
                              : null;

                        field.onChange(value);
                        handleChange && handleChange(value);
                        setTooltip(false);
                      }}
                      components={{
                        ValueContainer: CustomValueContainer as any,
                      }}
                      placeholder={placeholder}
                      classNamePrefix="your-selector"
                      isSearchable={isSearchable}
                      isClearable={isClearable}
                    />
                    {!isMenuOpen && tooltip && tooltipText ? (
                      <div className={style.tooltip}>
                        <div className={style.tooltipChild}>
                          <p className={style.tooltipText}>{tooltipText}</p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              }}
            ></Controller>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(SelectBox);

const setDefaultValueInSelectBox = (value: any, options: OptionsInterface[]) => {
  if (_.isString(value)) return options.find((c) => c.value === value || c?.label === value);
  if (_.isArray(value)) return options.filter((option) => value.includes(option.value));
  if (value) return options.find((c) => c.value === value || c?.label === value);
  return null;
};
