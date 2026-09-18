# Spec Delta

## Purpose

Provide a static, browser-local workout planner that shows the trainer's fixed machine-based prescription and lets the client record what was actually completed without losing historical sessions.

## ADDED Requirements

### Requirement: Fixed exercise and machine plan

The system SHALL present five fixed training days, each with the exercise name, machine, stable exercise identifier, target repetition range, target RIR, target rest, and any trainer-provided setup instructions.

#### Scenario: Client opens a training day

- **WHEN** the client selects a training day
- **THEN** the system shows the exact fixed exercises and machines assigned to that day rather than generic alternatives

#### Scenario: Exercise has machine setup guidance

- **WHEN** setup information exists for an exercise
- **THEN** the system shows that information as guidance before the client records the set

### Requirement: Published weekly recommendation

The system SHALL show the current trainer-published recommendation separately from the client's actual result, including planned series, repetition minimum and maximum, target RIR, and a planned weight for each series.

#### Scenario: Recommendation has different weights by series

- **WHEN** the weekly recommendation specifies different weights for separate series
- **THEN** the system shows each series with its own planned weight

#### Scenario: Recommendation is updated for a new week

- **WHEN** a new static weekly recommendation is published
- **THEN** the system shows the new recommendation while retaining historical session records from previous weeks

### Requirement: Actual session recording

The system SHALL allow the client to record actual weight, actual repetitions, actual RIR, sensations, discomfort, per-exercise lumbar pain where applicable, session status, and session-level lumbar pain without overwriting the published recommendation.

#### Scenario: Client uses less weight than planned

- **WHEN** the client cannot complete the planned load
- **THEN** the client can enter a lower actual weight and actual repetitions for the affected series while the planned values remain visible

#### Scenario: Client completes fewer or more series

- **WHEN** the client performs a different number of series from the recommendation
- **THEN** the system stores the performed series and does not require the client to invent data for unperformed series

#### Scenario: Client records fatigue or discomfort

- **WHEN** the client enters sensations, discomfort, or lumbar pain
- **THEN** the system stores those values with the current exercise or session and includes them in the completed-session summary

### Requirement: Stable local historical records

The system SHALL store session records in browser-local storage using stable exercise identifiers and a versioned data format so changes to display order or exercise labels cannot associate a previous result with another exercise.

#### Scenario: Client starts a new week

- **WHEN** the published recommendation's week changes
- **THEN** the system creates or loads a distinct record for the new week without deleting previous weeks

#### Scenario: Existing local data is encountered

- **WHEN** the system finds records from the current application's older positional format
- **THEN** the system follows an explicit migration or compatibility policy and does not silently assign ambiguous records to different fixed exercises

#### Scenario: Client exports data

- **WHEN** the client uses the export action
- **THEN** the system downloads all records owned by the application, including historical weeks and their actual values

### Requirement: Completion and WhatsApp summary

The system SHALL allow the client to finish a session and generate a readable summary containing the exercise, planned values, actual values, RIR, sensations, discomfort, pain fields, warm-up status, and session comments.

#### Scenario: Client finishes a valid session

- **WHEN** the required warm-up is complete and the client selects the finish action
- **THEN** the system marks the session complete, preserves its data, and displays the summary

#### Scenario: Client shares a completed session

- **WHEN** the client selects WhatsApp sharing
- **THEN** the system opens the existing manual WhatsApp share flow with the completed summary as the message body

### Requirement: Static and private operation

The system SHALL operate without a backend, account, API, analytics tracker, or automatic import of received WhatsApp messages, and SHALL keep client session data in the browser unless the client explicitly exports or shares it.

#### Scenario: Site is served as static files

- **WHEN** the site is hosted through a static HTTP or HTTPS server
- **THEN** the plan data and application load without a project-specific application server

#### Scenario: Client does not share data

- **WHEN** the client records a session without using export or sharing
- **THEN** the recorded values remain in the local browser storage and are not sent to a remote service
