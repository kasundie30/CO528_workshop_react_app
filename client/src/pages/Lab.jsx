import React from "react";

export default function Lab() {
  return (
    <div className="grid">
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="eyebrow">Department of Computer Engineering</p>
            <h1 className="sectionTitle">University of Peradeniya</h1>
            <p className="muted">Workshop 2: Web Oriented Architecture</p>
          </div>
          <div className="tag">Due: 27th January 2026 • 3.30 p.m.</div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Lab Activity: Extending Web Applications with Event Driven Architecture (EDA)</h2>
        <p className="muted">
          Complete this lab with the group you formed during the last workshop session. Focus on
          evolving a synchronous system into an asynchronous, event-driven workflow.
        </p>
        <div className="grid">
          <div>
            <h3 className="sectionSubtitle">1. Objectives</h3>
            <p className="muted">
              Traditional REST based systems often struggle with scalability and resilience as they grow. This
              lab focuses on the architectural evolution of a synchronous system into an asynchronous one using an Event Bus.
            </p>
          </div>
          <div>
            <h3 className="sectionSubtitle">1.1 Intended Learning Outcomes (ILO’s)</h3>
            <ul className="list">
              <li>Transform synchronous API flows into asynchronous event driven workflows.</li>
              <li>Apply principles of Loose Coupling and Resilience.</li>
              <li>Design and implement Producer Consumer patterns.</li>
              <li>Evaluate architectural trade-offs in modern web systems.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">2. System Architecture</h2>
        <div className="grid">
          <div className="highlight">
            <h3 className="sectionSubtitle">2.1 Existing Architecture (Synchronous)</h3>
            <p className="muted">
              The current system relies on direct, blocking calls between the UI, Backend, and Database.
            </p>
          </div>
          <div className="highlight">
            <h3 className="sectionSubtitle">2.2 Target Architecture (Asynchronous)</h3>
            <p className="muted">
              The evolved system introduces an Event Bus to decouple the primary API from side effects (consumers).
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">3. Lab Tasks</h2>
        <div className="grid">
          <div className="taskBlock">
            <h3 className="sectionSubtitle">Task 1: Identify a Domain Event</h3>
            <p className="muted">
              Select one existing API operation (e.g., Create Patient, Schedule Appointment, Generate Bill) and
              identify a meaningful Domain Event that occurs after the action (e.g., PatientRegistered, InvoiceGenerated).
              Do this for your own application.
            </p>
          </div>
          <div className="taskBlock">
            <h3 className="sectionSubtitle">Task 2: Implement the Event Producer</h3>
            <ol className="list">
              <li>Ensure the database operation completes successfully.</li>
              <li>Publish a domain event to the Event Bus after the DB commit.</li>
              <li>Return a response immediately without waiting for downstream processing.</li>
            </ol>
            <p className="muted">
              <b>Event Payload Requirement:</b> Include the Event Name, Entity ID, Timestamp, and relevant metadata.
            </p>
          </div>
          <div className="taskBlock">
            <h3 className="sectionSubtitle">Task 3: Set Up the Event Bus</h3>
            <p className="muted">
              Integrate a message broker such as RabbitMQ, Kafka, or a simulated in-memory event emitter. The goal is
              architectural behavior, not deployment complexity.
            </p>
          </div>
          <div className="taskBlock">
            <h3 className="sectionSubtitle">Task 4: Implement Consumer Service(s)</h3>
            <ul className="list">
              <li>Develop at least one independent service (e.g., Notification Service or Analytics Service).</li>
              <li>The consumer must run as a separate process and must not block the main API if it fails.</li>
              <li>Verify decoupling: stop the consumer service and ensure the API still functions.</li>
              <li>Verify asynchronicity: show via logs that the API responds before consumer processing completes.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">4. Evaluation Criteria (Approval Checklist)</h2>
        <div className="checklist grid">
          <label className="checkItem">
            <input type="checkbox" disabled />
            Selected a meaningful domain event for the system.
          </label>
          <label className="checkItem">
            <input type="checkbox" disabled />
            Event published only after successful API execution.
          </label>
          <label className="checkItem">
            <input type="checkbox" disabled />
            Demonstrated asynchronous communication using a message broker or simulated bus.
          </label>
          <label className="checkItem">
            <input type="checkbox" disabled />
            Implemented at least one functional, independent consumer service.
          </label>
          <label className="checkItem">
            <input type="checkbox" disabled />
            Proved producer is not blocked by the consumer.
          </label>
          <label className="checkItem">
            <input type="checkbox" disabled />
            Provided a clear architecture diagram and technical justification.
          </label>
        </div>
      </section>
    </div>
  );
}
