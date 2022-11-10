import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { TextField } from "../textField";
import { SelectField } from "../selectField";
import { RadioBtn } from "../radioButton";

export const RelieveForm = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => setError(undefined), 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [error]);
  const initialValues = {
    name: "",
    employeeId: "",
    jobPosition: "",
    letterNumber: "",
    joiningDate: "",
    relievingDate: "",
    performance: "",
    gender: "male",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    employeeId: Yup.string().required("Required"),
    jobPosition: Yup.string().required("Required"),
    letterNumber: Yup.string().required("Required"),
    joiningDate: Yup.date().required("Required"),
    relievingDate: Yup.date().required("Required"),
    performance: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
  });
  const onSubmit = (val) => {
    const fetch = async () => {
      try {
        setError(undefined);
        console.time("request made");
        setIsDownloading(true);
        const res = await axios({
          method: "post",
          url: `http://localhost:1337/api/v1/employee/add`,
          // url: `${process.env.API_BASE_URL}/employee/add`,
          data: val,
          responseType: "arraybuffer",
        });
        console.log({ res });
        setIsDownloading(false);
        console.timeEnd("request made");
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Relieve_letter-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        setIsDownloading(false);
        const arrayBuffer = err.response.data;
        let arrayBufferConverted = JSON.parse(
          String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
        );
        setError(arrayBufferConverted);
        console.log(err);
      }
    };
    fetch();
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  const performanceOptions = ["excellent", "good", "satisfactory", "bad"];
  const genderOptions = ["male", "female"];
  return (
    <section className="rlv-wrapper">
      <form className="rlv-form shadow">
        <h2>Relieve form</h2>
        <div>
          <TextField
            placeholder="Name"
            name="name"
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <TextField
            placeholder="Employee ID"
            name="employeeId"
            value={formik.values.employeeId}
            error={formik.touched.employeeId && formik.errors.employeeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <RadioBtn
            options={genderOptions}
            label="Gender"
            name="gender"
            value={formik.values.gender}
            setFieldValue={formik.setFieldValue}
          />
        </div>
        <div>
          <TextField
            placeholder="Jop position"
            name="jobPosition"
            value={formik.values.jobPosition}
            error={formik.touched.jobPosition && formik.errors.jobPosition}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <TextField
            type="number"
            placeholder="Letter Number"
            name="letterNumber"
            value={formik.values.letterNumber}
            error={formik.touched.letterNumber && formik.errors.letterNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <SelectField
            placeholder="Performance"
            options={performanceOptions}
            name="performance"
            value={formik.values.performance}
            error={formik.touched.performance && formik.errors.performance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <TextField
            type="date"
            placeholder="Joining date"
            name="joiningDate"
            value={formik.values.joiningDate}
            error={formik.touched.joiningDate && formik.errors.joiningDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <TextField
            type="date"
            placeholder="Relieving date"
            name="relievingDate"
            value={formik.values.relievingDate}
            error={formik.touched.relievingDate && formik.errors.relievingDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="export-btn-cntr ">
          <button
            className={`btn btn-primary ${isDownloading && "animate"}`}
            type="button"
            onClick={formik.handleSubmit}
          >
            {isDownloading ? "Download will begin shortly" : "Export to pdf"}
          </button>
        </div>
      </form>
      {error && <section className="err-popup">{error.message}!</section>}
    </section>
  );
};
