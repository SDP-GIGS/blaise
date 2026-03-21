import React, { useState } from "react";

const AccordionContext = React.createContext();

export const Accordion = ({ children, className }) => {
  const [openItem, setOpenItem] = useState(null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={`space-y-2 ${className || ""}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ children, value, className }) => {
  const { openItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow transition-shadow ${className || ""}`}
      data-state={isOpen ? "open" : "closed"}
      data-value={value}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { itemValue: value }),
      )}
    </div>
  );
};

export const AccordionTrigger = ({ children, className, itemValue }) => {
  const { openItem, setOpenItem } = React.useContext(AccordionContext);
  const isOpen = openItem === itemValue;
  return (
    <div
      className={`cursor-pointer flex justify-between items-center w-full px-6 py-5 hover:no-underline group ${className || ""}`}
      onClick={() => setOpenItem(isOpen ? null : itemValue)}
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
    </div>
  );
};

export const AccordionContent = ({ children, className, itemValue }) => {
  const { openItem } = React.useContext(AccordionContext);
  if (openItem !== itemValue) return null;
  return <div className={`px-6 pb-6 ${className || ""}`}>{children}</div>;
};
