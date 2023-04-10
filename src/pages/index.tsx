import React from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

type FormValues = {
  measurement0: string;
  measurement1: string;
  measurement2: string;
  measurement3: string;
};

const validationSchema = Yup.object().shape({
  measurement0: Yup.string().required("name is required"),
  measurement1: Yup.string().required("Technicall skill is required"),
  measurement2: Yup.string().required("Soft skill is required"),
  measurement3: Yup.string().required("Independence is required"),
});

const initialValues = {
  measurement0: "",
  measurement1: "",
  measurement2: "",
  measurement3: "",
};

const App = () => {
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const { measurement0, measurement1, measurement2, measurement3 } = values;

      const measurements = [
        { type: "Student Name", value: measurement0 },
        { type: "Technical Skill", value: measurement1 },
        { type: "Soft Skill", value: measurement2 },
        { type: "Independence", value: measurement3 },
      ];
      const response = await fetch("/api/report", {
        method: "POST",
        body: JSON.stringify(measurements),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = await response.blob();
      const url: string = window.URL.createObjectURL(new Blob([blob]));
      const link: HTMLAnchorElement = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${measurement0}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ marginBottom: "20px" }}>Generate PDF Report</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
      >
        {({ isSubmitting }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="measurement0">Student name</label>
              <Field
                type="text"
                id="measurement0"
                name="measurement0"
                style={{
                  height: "30px",
                  borderRadius: "15px",
                  border: "1px solid black",
                  width: "200px",
                  paddingLeft: "10px",
                }}
              />
              <div style={{ color: "red" }}>
                <ErrorMessage name="measurement0" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="measurement1">Technical Skill</label>
              <Field
                type="text"
                id="measurement1"
                name="measurement1"
                style={{
                  height: "30px",
                  borderRadius: "15px",
                  border: "1px solid black",
                  width: "200px",
                  paddingLeft: "10px",
                }}
              />
              <div style={{ color: "red" }}>
                <ErrorMessage name="measurement1" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="measurement2">Soft Skill</label>
              <Field
                type="text"
                id="measurement2"
                name="measurement2"
                style={{
                  height: "30px",
                  borderRadius: "15px",
                  border: "1px solid black",
                  width: "200px",
                  paddingLeft: "10px",
                }}
              />
              <div style={{ color: "red" }}>
                <ErrorMessage name="measurement2" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="measurement3">Independence</label>
              <Field
                type="text"
                id="measurement3"
                name="measurement3"
                style={{
                  height: "30px",
                  borderRadius: "15px",
                  border: "1px solid black",
                  width: "200px",
                  paddingLeft: "10px",
                }}
              />
              <div style={{ color: "red" }}>
                <ErrorMessage name="measurement3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                border: "1px solid black",
                height: "30px",
                borderRadius: "15px",
                backgroundColor: "white",
              }}
            >
              {isSubmitting ? "Generating Report..." : "Generate Report"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
