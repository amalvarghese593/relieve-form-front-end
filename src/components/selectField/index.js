export const SelectField = ({ options, placeholder, error, ...rest }) => {
  return (
    <>
      <select className="form-select" {...rest}>
        <option value="">--Select {placeholder}--</option>
        {options.map((option, idx) => (
          <option className="capitalize" key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="error">{error}</div>}
    </>
  );
};
