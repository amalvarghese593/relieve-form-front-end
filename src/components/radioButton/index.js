export const RadioBtn = ({ options, label, setFieldValue, name, value }) => {
  return (
    <>
      <label className="radio-lbl">{label}</label>
      <div className="radio-wpr">
        {options.map((option, idx) => (
          <div key={idx}>
            <input
              value={option}
              checked={option === value}
              type="radio"
              name={name}
              onChange={(e) => setFieldValue(name, e.target.value)}
              className="form-check-input"
            />
            <label className="capitalize">{option}</label>
          </div>
        ))}
      </div>
    </>
  );
};
