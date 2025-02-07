import React from "react";

const HelloPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hello, Welcome to React!</h1>
      <p style={styles.text}>This is a simple Hello Page.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#3498db",
    fontSize: "2rem",
  },
  text: {
    fontSize: "1.2rem",
    color: "#555",
  },
};

export default HelloPage;
