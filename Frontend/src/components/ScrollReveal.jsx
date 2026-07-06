import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";

const ScrollReveal = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </Motion.div>
  );
};

export default ScrollReveal;

