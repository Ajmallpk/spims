import Select from "react-select";

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder,
  isDisabled = false,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#14b8a6" : "#e5e7eb",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(20,184,166,.15)"
        : "none",
      "&:hover": {
        borderColor: "#14b8a6",
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#ccfbf1"
        : state.isSelected
        ? "#14b8a6"
        : "#fff",
      color: state.isSelected ? "#fff" : "#111827",
      cursor: "pointer",
    }),
  };

  return (
    <Select
      styles={customStyles}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable
      isClearable
      isDisabled={isDisabled}
    />
  );
};

export default SearchableSelect;