---
date: 2026-07-20
Subject:
  - Build → Test → Improve → Deploy
---
---

# Phase 1 — Initiation

Duration

Week 1

---

## Objectives

กำหนดขอบเขตของโปรเจกต์

---

## Key Activities

- วิเคราะห์ปัญหา
- วิเคราะห์ผู้ใช้งาน
- ระบุ Stakeholders
- Define MVP
- Define Success Metrics
- วิเคราะห์คู่แข่ง
- Kickoff Meeting

---

## Deliverables

- Project Charter
- Business Requirement
- PRD
- Stakeholder List
- Success Metrics

---

# Phase 2 — Planning

Duration

Week 1

---

## Activities

### Project Planning

กำหนด

- Timeline
- Sprint
- Resource
- Budget
- Scope

---

### Technical Planning

ออกแบบ

- [ ] IoT Architecture
- [ ] Backend Architecture
- [ ] Frontend Architecture
- [ ] Database
- [ ] API

---

### Deliverables

- WBS
- Sprint Plan
- Roadmap
- Architecture Diagram
- ER Diagram
- API List

---

# Phase 3 — System Design

Duration

Week 1-2

---

## UI Design

ออกแบบ

Dashboard

Ward

Bed Card

Alert Center

Analytics

Settings

---

## UX Flow

- Login
- Dashboard
- Ward
- Alert
- Device

---

## Technical Design

ออกแบบ

- Database
- API
- WebSocket
- Notification
- Device Communication

---

## Deliverables

- Wireframe
- High Fidelity UI
- Design System
- API Specification
- Database Schema
- Sequence Diagram

---

# Phase 4 — Development (Core Phase)

Duration

Week 2-10

แบ่งเป็น 6 Sprint

---

# Sprint 1

Goal

Foundation

Activities

- Project Setup
- Docker
- PostgreSQL
- Prisma
- Authentication
- Layout
- Sidebar
- Dashboard Skeleton

Deliverables

✓ Login

✓ Dashboard Layout

✓ Database

---

# Sprint 2

Goal

Ward Management

Activities

- Ward
- Bed Grid
- Patient
- Device CRUD

Deliverables

✓ Ward Page

✓ Bed Card

✓ Patient Detail

---

# Sprint 3

Goal

Realtime

Activities

- ESP32
- Socket.IO
- Live Dashboard
- Mock Device

Deliverables

✓ Live Update

✓ Device Connection

✓ Mock Sensor

---

# Sprint 4

Goal

Alert Engine

Activities

- Critical Alert
- Empty Alert
- Offline Alert
- Telegram

Deliverables

✓ Alert Center

✓ Notification

---

# Sprint 5

Goal

Analytics

Activities

- Charts
- KPI
- Statistics
- Priority Queue

Deliverables

✓ Dashboard Analytics

✓ Priority Engine

---

# Sprint 6

Goal

Stabilization

Activities

- Bug Fix
- Performance
- UX Improve
- Documentation

Deliverables

✓ MVP Ready

---





# Phase 5 — Testing

Duration

Week 9-11

---

## Testing Type

### Unit Test

Backend Logic

---

### Integration Test

IoT

↓

Backend

↓

Frontend

---

### System Test

ทั้งระบบ

---

### UAT

ทดลองกับผู้ใช้งานจริง

---

### Load Test

100+

Device

พร้อมกัน

---

## Deliverables

- Test Plan
- Test Case
- Bug Report
- UAT Report

---

# Phase 6 — Production Deployment

Duration

Week 12

---

## Activities

Deploy

Backend

Frontend

Database

Monitoring

Notification

---

## Checklist

- Docker Image
- Environment
- Backup
- SSL
- Domain
- Monitoring
- Log

---

## Deliverables

Production Ready

Deployment Guide

Runbook

Rollback Guide

---

# Phase 7 — Maintenance

หลังเปิดใช้งาน

---

## Activities

Monitoring

Bug Fix

Performance

Feature Improvement

Backup

Log Review

---

## KPI
- System Availability 99%
- Alert Delay <10 sec
- Dashboard Response <5 sec

---

# Deliverables Summary

| Phase       | Deliverables                           |
| ----------- | -------------------------------------- |
| Initiation  | Project Charter, PRD, Stakeholder List |
| Planning    | WBS, Roadmap, Sprint Plan              |
| Design      | Wireframe, UI Design, Architecture     |
| Development | Source Code, API, Dashboard            |
| Testing     | Test Script, Bug Report                |
| Deployment  | Docker, Deployment Guide               |
| Maintenance | Monitoring Dashboard, Incident Report  |
