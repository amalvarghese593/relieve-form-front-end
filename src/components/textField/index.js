export const TextField = ({ error, type, ...rest }) => {
  return (
    <>
      <input
        type={type !== "date" ? type : "text"}
        className="form-control"
        onFocus={(e) => {
          if (type === "date") e.target.type = "date";
        }}
        {...rest}
      />
      {error && <div className="error">{error}</div>}
    </>
  );
};
