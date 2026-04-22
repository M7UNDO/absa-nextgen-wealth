import React, { useState } from "react";
import "../styles/TrackAccordionSection";

function TrackAccordionSection({ title = "Did you know?", items }) {
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <section className="path-section">
      <h2>{title}</h2>

      <div className="accordion-list">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={openAccordion === index ? "accordion-item open" : "accordion-item"}
          >
            <button
              type="button"
              className="accordion-trigger"
              onClick={() =>
                setOpenAccordion(openAccordion === index ? null : index)
              }
            >
              <span>{item.title}</span>
              <i
                className={
                  openAccordion === index
                    ? "fa-solid fa-minus"
                    : "fa-solid fa-plus"
                }
              ></i>
            </button>

            {openAccordion === index && (
              <div className="accordion-content">
                <p>{item.content}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrackAccordionSection;