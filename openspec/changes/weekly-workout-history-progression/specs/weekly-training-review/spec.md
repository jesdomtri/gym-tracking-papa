# Spec Delta

## Purpose

Keep dated, faithful records of weekly training reports and use verified performance to prepare trainer-reviewed prescriptions. This allows progress to be compared over time without inventing missing data or conflating results from different machines.

## ADDED Requirements

### Requirement: Preserve dated weekly workout history
The system SHALL retain each reported workout under its calendar training week and session date, preserving planned and actual sets, exercise and machine text, setup notes, and session details.

#### Scenario: Reports span multiple calendar weeks
- **WHEN** the trainer archives a WhatsApp export containing workouts from multiple weeks
- **THEN** each workout is stored under the file for its week and identified by its workout date

#### Scenario: A report contains generic or ambiguous exercise names
- **WHEN** a historical workout cannot be matched unambiguously to a fixed exercise
- **THEN** its original description and values are retained without assigning a guessed stable exercise ID

### Requirement: Keep unknown and anomalous source data faithful
The system SHALL distinguish unreported values from known values and retain source-reported data even when a trainer excludes it from progression decisions.

#### Scenario: A source field is blank or marked pending
- **WHEN** RIR, pain, or another field was not supplied in the report
- **THEN** the archive preserves it as unknown or pending and does not infer a value

#### Scenario: A recorded value is excluded from progression review
- **WHEN** the trainer flags a source value as anomalous or asks not to use it for progression
- **THEN** the historical record remains faithful to the message while the value is excluded from load decisions

### Requirement: Apply the agreed double-progression rule
The trainer's weekly recommendation SHALL retain the established repetition ranges and use valid, comparable performance to increase, maintain, or reduce prescribed load.

#### Scenario: Every prescribed set reaches the upper bound
- **WHEN** every prescribed set with valid comparable results reaches or exceeds the range maximum
- **THEN** the next recommendation increases load by the smallest verified available machine increment and retains the repetition range

#### Scenario: Performance remains within the repetition range
- **WHEN** valid results are at or above the minimum but not every prescribed set reaches the maximum
- **THEN** the next recommendation maintains load and the client continues progressing repetitions within the same range

#### Scenario: Reliable performance falls below the range minimum
- **WHEN** valid, non-excluded performance falls below the prescribed minimum
- **THEN** the trainer considers a lower load for the next recommendation rather than treating the result as a successful progression

#### Scenario: One or more prescribed sets lack usable results
- **WHEN** the report omits a prescribed set or its result is explicitly excluded
- **THEN** the missing or excluded result does not count toward the all-sets threshold for increasing load

### Requirement: Preserve exercise identity across machine changes
The system SHALL identify a fixed exercise-machine pairing with a stable ID and SHALL NOT compare or silently reassign historical records across different machines.

#### Scenario: The biceps curl changes to the Impulse machine
- **WHEN** the fixed plan is published with the Impulse biceps curl
- **THEN** it uses a new stable exercise ID and historical DHZ records remain associated with the former DHZ identity

#### Scenario: A message contains conflicting machine details
- **WHEN** a historical message's heading and note name different machines
- **THEN** the archive preserves both source details and progression uses only the machine interpretation explicitly confirmed by the trainer

### Requirement: Keep weekly publication manual and static
The system SHALL publish the trainer-reviewed weekly prescription as static data and SHALL NOT automatically import incoming WhatsApp messages or calculate and publish progression.

#### Scenario: A new week is prepared
- **WHEN** the trainer reviews the archived results for a new week
- **THEN** the published prescription contains all fixed exercises, their repetition ranges, target RIR, planned sets, and per-set loads approved by the trainer

#### Scenario: A published recommendation changes
- **WHEN** static recommendation data is updated
- **THEN** the site serves the new recommendation while retaining browser-local records from prior weeks
